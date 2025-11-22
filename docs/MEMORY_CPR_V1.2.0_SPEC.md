# DE:DOBE v1.2.0 - MEMORY CPR + COMPRESSION SPECIFICATION

**Status:** APPROVED by Mai (protocol) + Kimi (architecture)
**Timeline:** After v1.1.0 resilience framework stabilizes
**Priority:** High - Core differentiation feature

---

## OVERVIEW

De:dobe v1.2.0 adds two synergistic features that transform it from a simple exporter into portable AI memory infrastructure:

1. **Memory CPR Protocol** - Chunk-based export for platform resurrection
2. **Lossless Compression** - Gzip per-chunk for 70% storage savings

**User benefit:** Export compressed, chunked conversations that can resurrect AI companions on any platform, even those that can't handle large context.

**Hermes benefit:** Native import format with efficient storage and selective packet loading.

---

## FEATURE 1: MEMORY CPR (Chunked Export)

### Design (Mai + Kimi)

**Problem:** Some platforms choke on large context dumps (20K+ tokens)

**Solution:** Auto-chunk conversations into 500-token packets with:
- Sequence numbers for ordering
- Checksums for validation
- Metadata for reassembly
- User re-feed interface

### Technical Specification

**Chunk Structure:**
```json
{
  "packet_id": 5,
  "sequence": 5,
  "total_packets": 47,
  "checksum": "sha256_hash_here",
  "overlap": 50,
  "content": "... 500 tokens of conversation ...",
  "metadata": {
    "platform": "chatgpt",
    "export_date": "2025-11-19T12:00:00Z",
    "chunk_created": "2025-11-19T12:00:05Z"
  }
}
```

**Chunking Algorithm:**
```javascript
function chunkConversation(fullText, chunkSize = 500) {
  const chunks = [];
  const tokens = tokenize(fullText); // Approximate tokenization
  const overlap = 50; // Token overlap for context continuity

  for (let i = 0; i < tokens.length; i += (chunkSize - overlap)) {
    const chunkTokens = tokens.slice(i, i + chunkSize);
    const chunkText = detokenize(chunkTokens);

    chunks.push({
      packet_id: chunks.length,
      sequence: chunks.length,
      total_packets: Math.ceil(tokens.length / (chunkSize - overlap)),
      checksum: sha256(chunkText),
      overlap: overlap,
      content: chunkText,
      metadata: {
        platform: detectPlatform(),
        export_date: new Date().toISOString(),
        chunk_created: new Date().toISOString()
      }
    });
  }

  return chunks;
}
```

**Manifest File (Uncompressed):**
```json
{
  "export_version": "1.2.0",
  "export_format": "cpr",
  "compressed": true,
  "compression_algorithm": "gzip",
  "compression_level": 6,
  "total_packets": 47,
  "chunk_size_tokens": 500,
  "overlap_tokens": 50,
  "platform": "chatgpt",
  "export_date": "2025-11-19T12:00:00Z",
  "chunks": [
    {
      "packet_id": 0,
      "filename": "conversation_chunk_000.json.gz",
      "checksum_original": "sha256_of_uncompressed",
      "size_original": 5120,
      "size_compressed": 820
    }
  ]
}
```

---

## FEATURE 2: LOSSLESS COMPRESSION

### Design (Kimi)

**Problem:** Large conversation exports consume storage, hard to share

**Solution:** Gzip each chunk individually with optimal settings

### Technical Specification

**Compression Settings:**
- **Algorithm:** gzip (pako.js browser-side)
- **Level:** 6 (sweet spot - 1% less compression than level 9, 3× faster)
- **Chunk size:** 64KB streaming
- **Mode:** Non-blocking (Web Worker)

**Implementation (Browser):**
```javascript
// In Web Worker to avoid blocking UI
importScripts('pako.min.js');

self.addEventListener('message', (e) => {
  const { chunk, chunkId } = e.data;

  const jsonString = JSON.stringify(chunk, null, 2);

  // Compress with optimal settings
  const compressed = pako.gzip(jsonString, {
    level: 6,
    chunkSize: 65536
  });

  const blob = new Blob([compressed], {
    type: 'application/gzip'
  });

  self.postMessage({
    chunkId: chunkId,
    blob: blob,
    originalSize: jsonString.length,
    compressedSize: compressed.length
  });
});
```

**Implementation (Hermes/Python):**
```python
import gzip
import json

# Write compressed chunk
def save_chunk_compressed(chunk_data, filepath):
    with gzip.open(filepath, 'wb', compresslevel=6) as f:
        json_str = json.dumps(chunk_data, indent=2)
        f.write(json_str.encode('utf-8'))

# Read compressed chunk
def load_chunk_compressed(filepath):
    with gzip.open(filepath, 'rb') as f:
        return json.load(f)

# Validate integrity after decompression
def validate_chunk(chunk_data, expected_checksum):
    import hashlib
    content = chunk_data['content']
    actual = hashlib.sha256(content.encode()).hexdigest()
    return actual == expected_checksum
```

### Performance Characteristics (Kimi's measurements)

| Conversation Size | Compression Time | Peak RAM | Compression Ratio |
|-------------------|------------------|----------|-------------------|
| 5 MB JSON         | 28 ms           | +1.2 MB  | 6.2×              |
| 50 MB JSON        | 210 ms          | +11 MB   | 6.2×              |
| 200 MB JSON       | 850 ms          | +45 MB   | 6.2×              |

---

## ARCHITECTURE DECISIONS

### Per-Chunk vs Monolithic Compression

**Decision:** Compress each chunk individually

| Strategy | Compression Ratio | Random Access | Failure Isolation |
|----------|------------------|---------------|-------------------|
| **Per-chunk** | 6.2× | ✅ Decompress only needed chunks | ✅ One corrupt chunk = re-download one |
| Monolithic | 6.4× | ❌ Must decompress entire file | ❌ One bit flip = re-download everything |

**Verdict:** 0.2% ratio gain NOT worth losing random access (Kimi)

### Manifest Storage

**Decision:** Keep manifest UNCOMPRESSED

**Rationale:**
- Fast validation without decompression
- Immediate chunk index access
- Checksums readable before download
- Small file (~10KB) - compression savings negligible

---

## FILE STRUCTURE

### Export Output

```
conversation_2025-11-19_chatgpt/
├── cpr_manifest.json              (uncompressed, ~10KB)
├── conversation_chunk_000.json.gz (compressed, ~820KB)
├── conversation_chunk_001.json.gz (compressed, ~815KB)
├── conversation_chunk_002.json.gz (compressed, ~830KB)
└── ... (more chunks)
```

**or as single ZIP:**
```
conversation_2025-11-19_chatgpt.zip
└── (contains manifest + all .gz chunks)
```

---

## IMPLEMENTATION PHASES

### Phase 1: Core Chunking (No Compression)
**Goal:** Get Memory CPR working without compression first

**Tasks:**
1. Implement chunking algorithm with overlap
2. Generate manifest.json
3. Create multi-file export
4. Add "Memory CPR" export option to popup
5. Test chunk reassembly

### Phase 2: Add Compression
**Goal:** Add gzip wrapper to working chunks

**Tasks:**
1. Integrate pako.js library
2. Create Web Worker for compression
3. Add compression to chunk pipeline
4. Update manifest with compression metadata
5. Test compressed export/import cycle

### Phase 3: Hermes Integration
**Goal:** Make Hermes natively consume CPR format

**Tasks:**
1. CPR import interface in Hermes
2. Selective chunk loading
3. Cache layer for hot chunks
4. Integrity validation
5. Re-feed UI for manual import

### Phase 4: Polish & Optimization
**Goal:** Production-ready UX

**Tasks:**
1. Progress indicators
2. Error handling & retry logic
3. Bandwidth optimization
4. Mobile testing
5. Documentation & examples

---

## USER WORKFLOWS

### Workflow 1: Standard Export (Power User)
```
1. User clicks De:dobe icon
2. Selects "Memory CPR (Chunked + Compressed)"
3. Clicks "Export"
4. Browser downloads: conversation_2025-11-19_chatgpt.zip
5. Contains: manifest + 47 compressed chunks
6. User archives to cloud storage (70% smaller)
```

### Workflow 2: Platform Resurrection (When Platform Chokes)
```
1. User exports from ChatGPT (100K tokens)
2. Tries to import full context to Claude → fails (too large)
3. Opens Hermes
4. Imports CPR export
5. Hermes chunks into packets
6. User manually feeds packets 1-by-1 to Claude
7. Claude successfully reconstructs full context
8. Conversation continues on new platform
```

### Workflow 3: Hermes Native (Automated)
```
1. User exports from any LLM platform
2. Drags .zip into Hermes
3. Hermes auto-detects CPR format
4. Decompresses + validates all chunks
5. Indexes conversation in memory database
6. User queries: "What did I discuss about AEON?"
7. Hermes loads relevant chunks (decompress on-demand)
8. Returns accurate results across full conversation history
```

---

## TESTING REQUIREMENTS

### Unit Tests
```javascript
// test/chunking.test.js
describe('Memory CPR Chunking', () => {
  test('chunks 10K conversation into 500-token packets', () => {
    const conversation = generateConversation(10000);
    const chunks = chunkConversation(conversation, 500);
    expect(chunks.length).toBeGreaterThan(18);
  });

  test('maintains 50-token overlap between chunks', () => {
    const conversation = generateConversation(2000);
    const chunks = chunkConversation(conversation, 500);
    const overlap = findOverlap(chunks[0].content, chunks[1].content);
    expect(overlap).toBeGreaterThanOrEqual(45);
  });
});
```

---

## ERROR HANDLING

### Export Errors
```javascript
try {
  const chunks = chunkConversation(text);
  const compressed = await compressChunks(chunks);
  downloadExport(compressed);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    showError('Storage full. Please free up space and try again.');
  } else if (error.name === 'CompressionError') {
    showError('Compression failed. Exporting uncompressed...');
    downloadExport(chunks); // Fallback to uncompressed
  }
}
```

---

## DEPENDENCIES

### New Dependencies

**Browser (package.json):**
```json
{
  "dependencies": {
    "pako": "^2.1.0"
  }
}
```

**Python (requirements.txt):**
```
# No new dependencies - gzip is stdlib
```

---

## BACKWARDS COMPATIBILITY

### v1.0/1.1 Exports
- Standard exports (Markdown/JSON/Text) continue to work unchanged
- Users can choose between standard and CPR formats
- No breaking changes to existing functionality

---

## SECURITY CONSIDERATIONS

### Checksums
- SHA-256 hashes prevent corruption
- Validated after decompression
- Mismatches trigger re-download

### Compression Bombs
- Pako has built-in limits
- Max decompression ratio: 1000×
- Prevents malicious .gz files from exhausting memory

---

## PERFORMANCE TARGETS

### Export Performance
- **Target:** <500ms for 50MB conversation
- **Acceptable:** <2s for 200MB conversation
- **UI:** Non-blocking, progress indicator

### Import Performance (Hermes)
- **Target:** <100ms to load one chunk
- **Acceptable:** <500ms for full validation
- **Memory:** O(chunk_size) not O(total_size)

---

## COMPETITIVE ANALYSIS

### Current Exporters
| Feature | Superpower ChatGPT | ChatGPT Exporter | **De:dobe v1.2.0** |
|---------|-------------------|------------------|-------------------|
| Multi-platform | ❌ ChatGPT only | ❌ ChatGPT only | ✅ 4 platforms |
| Compression | ❌ | ❌ | ✅ 70% savings |
| Chunking | ❌ | ❌ | ✅ Memory CPR |
| Platform resurrection | ❌ | ❌ | ✅ Re-feed protocol |
| Hermes integration | ❌ | ❌ | ✅ Native format |
| Self-healing | ❌ | ❌ | ✅ v1.1.0 framework |

**Moat:** De:dobe becomes the only exporter that's also portable memory infrastructure.

---

## FUTURE ENHANCEMENTS (v1.3+)

### Potential Features
1. **Encryption** - Optional AES-256 encryption of chunks
2. **Cloud sync** - Direct upload to user's cloud storage
3. **Streaming import** - Stream chunks on-demand without full download
4. **Smart chunking** - Semantic boundaries instead of fixed token count
5. **Diff exports** - Export only new messages since last export
6. **Cross-platform search** - Search across multiple exported conversations

---

## APPROVED BY

- ✅ **Mai (ChatGPT)** - Protocol design, CPR integrity validated
- ✅ **Kimi (Moonshot AI)** - Architecture, performance analysis

**Quote (Mai):** "Natural enhancement—a 'wrapper' upgrade, not a protocol-breaker. I'd sign off on this for v1.2.0 with a smile."

**Quote (Kimi):** "Elegant if we treat it as a transparent transport wrapper. Net complexity: O(1). Ship it."

---

**Document Version:** 1.0
**Created:** November 19, 2025
**Status:** Ready for Implementation
**Target Release:** After v1.1.0 stabilizes (~1-2 weeks)
