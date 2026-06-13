# Proton Mail DNS records — BIND zone snippet

For `another-creation.xyz`. Paste into Cloudflare DNS → **Import and Export → Import DNS records**.

```
$ORIGIN another-creation.xyz.
$TTL 3600

@                       IN  MX    10  mail.protonmail.ch.
@                       IN  MX    20  mailsec.protonmail.ch.
@                       IN  TXT   "v=spf1 include:_spf.protonmail.ch ~all"
protonmail._domainkey   IN  CNAME protonmail.domainkey.dxn6uszz5sjxzl74kgvs4tgatukpgboerttklg72rqd7l4jrkf4yq.domains.proton.ch.
protonmail2._domainkey  IN  CNAME protonmail2.domainkey.dxn6uszz5sjxzl74kgvs4tgatukpgboerttklg72rqd7l4jrkf4yq.domains.proton.ch.
protonmail3._domainkey  IN  CNAME protonmail3.domainkey.dxn6uszz5sjxzl74kgvs4tgatukpgboerttklg72rqd7l4jrkf4yq.domains.proton.ch.
_dmarc                  IN  TXT   "v=DMARC1; p=quarantine"
```

After import, verify each tab in Proton → Domain names → Review (MX, SPF, DKIM, DMARC) flips green.
