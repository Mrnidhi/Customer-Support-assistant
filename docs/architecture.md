# SupportAI Knowledge Base - Architecture Documentation

## Overview

The SupportAI Knowledge Base is built using a modern RAG (Retrieval-Augmented Generation) architecture that combines vector search with large language models to provide intelligent answers to support queries.

## System Architecture

### High-Level Architecture

```mermaid
graph LR
    subgraph "Client"
        User[User]
        Browser[Web Browser]
    end
    
    subgraph "Frontend"
        NextJS[Next.js App]
        React[React Components]
    end
    
    subgraph "Backend"
        FastAPI[FastAPI Server]
        RAG[RAG Pipeline]
    end
    
    subgraph "AI/ML"
        Embeddings[Sentence Transformers]
        LLM[Google Gemini]
    end
    
    subgraph "Storage"
        ChromaDB[(ChromaDB)]
        Files[(JSON Files)]
    end
    
    User --> Browser
    Browser --> NextJS
    NextJS --> FastAPI
    FastAPI --> RAG
    RAG --> Embeddings
    RAG --> LLM
    Embeddings --> ChromaDB
    Files --> ChromaDB
```

### Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as FastAPI
    participant R as RAG Pipeline
    participant E as Embeddings
    participant C as ChromaDB
    participant G as Gemini AI
    
    U->>F: Enter Query
    F->>A: POST /answer
    A->>R: Process Query
    R->>E: Generate Query Embedding
    E->>C: Search Similar Vectors
    C-->>R: Return Relevant Tickets
    R->>G: Generate Answer with Context
    G-->>R: Return AI Response
    R-->>A: Return Answer + Sources
    A-->>F: JSON Response
    F-->>U: Display Results
```

### Component Architecture

```mermaid
graph TB
    subgraph "Frontend Components"
        Pages[Pages]
        Components[Components]
        Context[Context API]
        Hooks[Custom Hooks]
    end
    
    subgraph "Backend Modules"
        API[api.py]
        Config[config.py]
        RAG[rag_query.py]
        Chroma[chroma_index.py]
        Embed[embeddings.py]
        Data[data_loader.py]
    end
    
    subgraph "External Services"
        Gemini[Google Gemini API]
        Transformers[Sentence Transformers]
    end
    
    Pages --> Components
    Components --> Context
    Context --> Hooks
    
    API --> Config
    API --> RAG
    RAG --> Chroma
    RAG --> Embed
    RAG --> Data
    Embed --> Transformers
    RAG --> Gemini
```

## RAG Pipeline Details

### 1. Indexing Phase

```mermaid
graph LR
    A[Support Tickets JSON] --> B[Data Loader]
    B --> C[Text Preprocessing]
    C --> D[Sentence Transformers]
    D --> E[Vector Embeddings]
    E --> F[ChromaDB Storage]
    F --> G[Metadata Index]
```

### 2. Query Phase

```mermaid
graph LR
    A[User Query] --> B[Query Preprocessing]
    B --> C[Generate Query Embedding]
    C --> D[Semantic Search in ChromaDB]
    D --> E[Retrieve Top-K Results]
    E --> F[Extract Metadata]
    F --> G[Build Context Prompt]
    G --> H[Send to Gemini AI]
    H --> I[Generate Response]
    I --> J[Return Answer + Sources]
```

## Technology Stack

### Frontend Stack

```mermaid
graph TB
    subgraph "Frontend Technologies"
        NextJS[Next.js 15.3]
        React[React 19]
        Tailwind[Tailwind CSS]
        Lucide[Lucide Icons]
    end
    
    subgraph "Development Tools"
        ESLint[ESLint]
        PostCSS[PostCSS]
    end
```

### Backend Stack

```mermaid
graph TB
    subgraph "Framework & Server"
        FastAPI[FastAPI]
        Uvicorn[Uvicorn ASGI]
        Pydantic[Pydantic Models]
    end
    
    subgraph "AI/ML Libraries"
        Gemini[google-generativeai]
        Transformers[sentence-transformers]
        ChromaDB[chromadb]
    end
    
    subgraph "Utilities"
        Dotenv[python-dotenv]
        Requests[requests]
    end
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        Local[Local Machine]
        DevAPI[FastAPI Dev Server]
        DevFrontend[Next.js Dev Server]
    end
    
    subgraph "Production Environment"
        WebServer[Web Server]
        AppServer[Application Server]
        Database[Vector Database]
        CDN[Content Delivery Network]
    end
    
    Local --> DevAPI
    Local --> DevFrontend
    
    WebServer --> CDN
    WebServer --> AppServer
    AppServer --> Database
```

## Security Considerations

```mermaid
graph TB
    subgraph "Security Layers"
        CORS[CORS Protection]
        Validation[Input Validation]
        Auth[API Authentication]
        HTTPS[HTTPS Encryption]
    end
    
    subgraph "Data Protection"
        EnvVars[Environment Variables]
        Secrets[API Key Management]
        Privacy[Data Privacy]
    end
```

## Performance Optimization

```mermaid
graph LR
    A[Query Optimization] --> B[Vector Index]
    B --> C[Caching Layer]
    C --> D[Response Compression]
    D --> E[CDN Distribution]
```

## Monitoring & Logging

```mermaid
graph TB
    subgraph "Monitoring"
        Logs[Application Logs]
        Metrics[Performance Metrics]
        Errors[Error Tracking]
    end
    
    subgraph "Analytics"
        Usage[Usage Analytics]
        Queries[Query Analytics]
        Performance[Performance Analytics]
    end
```

This architecture provides a scalable, maintainable, and efficient system for AI-powered customer support analysis.
