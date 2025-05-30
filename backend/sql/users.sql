CREATE TABLE users (
    attuid VARCHAR(10) PRIMARY KEY,
    sup_attuid VARCHAR(10) NOT NULL,
    email VARCHAR(100),
    last_nm VARCHAR(100) NOT NULL,
    first_nm VARCHAR(100) NOT NULL,
    preferred_nm VARCHAR(100),
    job_title_nm VARCHAR(100),
    dept_nm VARCHAR(100),
    level VARCHAR(50),
    profile_picture TEXT,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_sup_attuid ON users(sup_attuid);
CREATE INDEX idx_users_last_nm ON users(last_nm);
CREATE INDEX idx_users_first_nm ON users(first_nm); 