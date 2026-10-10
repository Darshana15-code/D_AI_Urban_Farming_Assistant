# FloraPulse AI — Architecture Decision Records (ADRs)

## ADR-001: Decoupling ML Inference into a Dedicated Backend Service
- **Status**: Accepted
- **Context**: Running multi-megabyte machine learning models purely in client WebAssembly or browser canvas suffers from device memory limits on smartphones, lack of logging/auditing, and security concerns regarding model IP.
- **Decision**: Host convolutional model inference in a Python FastAPI backend service (`/api/v1/scans`).
- **Consequences**: Enables strict server-side validation of image bytes, calibrated temperature scaling, private image storage integration, and scalable deployment on edge container runtimes.

---

## ADR-002: Softmax Temperature Scaling and Explicit Inconclusive State
- **Status**: Accepted
- **Context**: Deep neural networks trained with cross-entropy loss tend to be overconfident, assigning >95% probability even to non-leaf or noisy inputs.
- **Decision**: Apply post-hoc Temperature Scaling ($T=1.35$) and enforce hard confidence thresholds ($< 0.65$) and margin checks ($< 0.12$). When an image fails foliar spectral checks or has low certainty, return `is_inconclusive = True` with clear instructions to retake the photo.
- **Consequences**: Eliminates misleading false certainties; builds user trust and aligns with responsible AI standards.

---

## ADR-003: Server-Side Identity Derivation & Database Row Level Security (RLS)
- **Status**: Accepted
- **Context**: In multi-tenant urban farming applications, a user must never be able to view, mutate, or delete another user's crops, scans, or watering records.
- **Decision**: User identity is derived strictly from verified cryptographic JWT token claims in the `Authorization: Bearer <token>` header, never from an untrusted request-body field. In Supabase PostgreSQL, all tables enforce `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` with policies matching `auth.uid() = user_id`.
- **Consequences**: Guarantees zero data leakage between gardeners even if a malicious client alters request parameters.

---

## ADR-004: Strict Decoupling of Agronomic Guidance from Model Predictions
- **Status**: Accepted
- **Context**: An AI classifier detects visual foliar features, not microbiological confirmation. Hallucinating chemical pesticide dosages or spray rates presents biological and food safety hazards.
- **Decision**: The classifier outputs a verified condition code (`tomato_early_blight`), which then queries an independently reviewed agronomic knowledge base synthesized from official extension sources (ICAR, TNAU, UC Davis IPM, Cornell). Chemical advice always includes safety warnings and registered label disclaimers.
- **Consequences**: Safe, science-backed guidance with transparent citations and zero hallucinated chemical applications.

---

## ADR-005: Context-Aware Watering Engine with Balcony Shelter Factor
- **Status**: Accepted
- **Context**: Traditional weather apps tell users "Rain today — skip watering". However, urban gardeners grow crops under covered balconies or rooftop overhangs where direct rain never touches container potting soil.
- **Decision**: The watering engine integrates Open-Meteo forecasts but adjusts recommendations based on plant growing location (`balcony` vs `garden_bed`) and container type (`terracotta_pot` vs `plastic_pot`). When rain is forecasted for a balcony plant, the engine explicitly alerts the user: *"Outdoor rain expected, but your plant is sheltered by a balcony ceiling—check soil moisture manually."*
- **Consequences**: Eliminates common urban gardening failures caused by blind reliance on outdoor weather forecasts.
