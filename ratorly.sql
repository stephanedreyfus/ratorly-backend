DROP DATABASE ratorly;
CREATE DATABASE ratorly;
\connect ratorly

\i ratorly-schema.sql

DROP DATABASE ratorly_test;
CREATE DATABASE ratorly_test;
\connect ratorly_test

\i ratorly-schema.sql
