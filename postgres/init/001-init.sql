\connect postgres

CREATE USER sizzle WITH LOGIN nocreatedb nocreaterole ENCRYPTED PASSWORD 'sizzle';
ALTER USER sizzle SET search_path TO public;

CREATE DATABASE "sizzle";
ALTER DATABASE  "sizzle" OWNER TO "sizzle";
