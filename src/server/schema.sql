CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    github_id VARCHAR(255) UNIQUE,
    email VARCHAR(255),
    state BLOB
);

CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    state BLOB
);

CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS 
paymentSession (
    id INTEGER PRIMARY KEY, 
    uuid VARCHAR(36) UNIQUE,
    created_at BIGINT DEFAULT CURRENT_TIMESTAMP,
    updated_at BIGINT DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT,
    content TEXT,
    user_id TEXT NOT NULL,
    website VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS 
keyPairs (
    id INTEGER PRIMARY KEY, 
    uuid VARCHAR(36) UNIQUE,
    created_at BIGINT DEFAULT CURRENT_TIMESTAMP,
    updated_at BIGINT DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL,
    publicKey TEXT,
    privateKey TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);