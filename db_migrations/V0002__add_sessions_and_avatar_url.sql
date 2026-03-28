ALTER TABLE t_p86558768_messenger_creation_p.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

CREATE TABLE t_p86558768_messenger_creation_p.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES t_p86558768_messenger_creation_p.users(id),
    token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);
