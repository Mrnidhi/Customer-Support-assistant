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
    
    classDef client fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#ffffff
    classDef frontend fill:#10b981,stroke:#059669,stroke-width:2px,color:#ffffff
    classDef backend fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
    classDef ai fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#ffffff
    classDef storage fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#ffffff
    
    class User,Browser client
    class NextJS,React frontend
    class FastAPI,RAG backend
    class Embeddings,LLM ai
    class ChromaDB,Files storage
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
    
    Note over U,G: SupportAI Query Processing Flow
    
    U->>F: Enter Query
    Note right of U: User types question<br/>about support tickets
    
    F->>A: POST /answer
    Note right of F: Send query to<br/>backend API
    
    A->>R: Process Query
    Note right of A: Initialize RAG<br/>pipeline processing
    
    R->>E: Generate Query Embedding
    Note right of R: Convert query to<br/>vector representation
    
    E->>C: Search Similar Vectors
    Note right of E: Find most relevant<br/>ticket embeddings
    
    C-->>R: Return Relevant Tickets
    Note left of C: Top-K matching<br/>tickets with scores
    
    R->>G: Generate Answer with Context
    Note right of R: Build prompt with<br/>retrieved ticket context
    
    G-->>R: Return AI Response
    Note left of G: Natural language<br/>answer generated
    
    R-->>A: Return Answer + Sources
    Note left of R: Structured response<br/>with source citations
    
    A-->>F: JSON Response
    Note left of A: API response with<br/>answer and metadata
    
    F-->>U: Display Results
    Note left of F: Show answer and<br/>source tickets to user
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
    
    classDef frontend fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#ffffff
    classDef backend fill:#059669,stroke:#047857,stroke-width:2px,color:#ffffff
    classDef external fill:#dc2626,stroke:#b91c1c,stroke-width:2px,color:#ffffff
    
    class Pages,Components,Context,Hooks frontend
    class API,Config,RAG,Chroma,Embed,Data backend
    class Gemini,Transformers external
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
