require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "fileinto", "imap4flags"];

# ─────────────────────────────────────────────
# Proton auto-generated: do not edit
# Skips filter processing on messages flagged as spam.
# ─────────────────────────────────────────────
if allof (environment :matches "vnd.proton.spam-threshold" "*",
spamtest :value "ge" :comparator "i;ascii-numeric" "${1}")
{
    return;
}

# ─────────────────────────────────────────────
# Another Creation: alias routing
# Labels mail by recipient address; mail stays in inbox.
# ─────────────────────────────────────────────

# hello@ → Clients
if address :is "to" "hello@another-creation.xyz" {
    fileinto "Clients";
}

# yr@ → Personal
if address :is "to" "yr@another-creation.xyz" {
    fileinto "Personal";
}

# dev@ → Providers
if address :is "to" "dev@another-creation.xyz" {
    fileinto "Providers";
}

# billing@ → Finance
if address :is "to" "billing@another-creation.xyz" {
    fileinto "Finance";
}

# legal@ → Legal
if address :is "to" "legal@another-creation.xyz" {
    fileinto "Legal";
}

# noreply@ → trash, mark read (inbound is misrouted or spam)
if address :is "to" "noreply@another-creation.xyz" {
    addflag "\\Seen";
    fileinto "Trash";
}
