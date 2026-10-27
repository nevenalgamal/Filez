-- TODO
CREATE TABLE  folders (
    id SERIAL  PRIMARY KEY,
    name text NOT NULL UNIQUE
);
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    size INTEGER NOT NULL,
    folder_id integer NOT NULL  REFERENCES folders(id) ON DELETE CASCADE,
    UNIQUE (name, folder_id)
);
