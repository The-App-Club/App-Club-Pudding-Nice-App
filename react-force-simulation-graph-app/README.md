- How To Work

generate data.

```bash
$ time node -r esm scripts/generate.js >public/data/dump.json ; cat public/data/dump.json | jq '' | sponge public/data/dump.json

real    0m2.215s
user    0m1.992s
sys     0m0.271s
```

- Reference
  - [d3 v5 force simulation: how to use stop & tick](https://stackoverflow.com/a/55446065/15972569)
  - [d3-force](https://github.com/d3/d3-force)
