CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    github_id VARCHAR(255) UNIQUE,
    username VARCHAR(255),
    email VARCHAR(255),
    avatar_url VARCHAR(255),
    hasPaid BOOLEAN DEFAULT FALSE,
    role VARCHAR(255) DEFAULT "USER",
    state BLOB
);

CREATE TABLE IF NOT EXISTS session (
    id INTEGER PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    expires_at INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS 
paymentSession (
    id INTEGER PRIMARY KEY, 
    created_at BIGINT DEFAULT CURRENT_TIMESTAMP,
    updated_at BIGINT DEFAULT CURRENT_TIMESTAMP,
    uuid VARCHAR(36) UNIQUE,
    session_id TEXT,
    content TEXT,
    user_id INTEGER NOT NULL,
    website VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS 
keyPairs (
    id INTEGER PRIMARY KEY, 
    uuid VARCHAR(36) UNIQUE,
    created_at BIGINT DEFAULT CURRENT_TIMESTAMP,
    updated_at BIGINT DEFAULT CURRENT_TIMESTAMP,
    doc VARCHAR(36),
    publicKey TEXT,
    privateKey TEXT
);

CREATE TABLE IF NOT EXISTS docs (
    id INTEGER PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    type VARCHAR(36),
    state BLOB
);