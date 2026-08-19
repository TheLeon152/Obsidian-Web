# Obsidian-Web

Web interface for accessing an Obsidian knowledge base remotely.

## Project Goal

Obsidian-Web provides a web-based interface for accessing selected parts of an Obsidian vault.

The goal is to allow:

* read-only access to the knowledge base
* access to Dataview-based dashboards
* creation of notes through a controlled inbox
* remote access without exposing the complete Obsidian vault

## Architecture

The project consists of:

* **Frontend** — Web UI
* **Backend** — API and Obsidian vault access
* **Obsidian Vault** — Local knowledge base, kept separate from this repository

## Security

The Obsidian vault itself is not part of this repository.

Secrets, credentials and local configuration must not be committed to Git.
