# Current limitations and to-do list

## Current limitations

- The dependency fields at the end of each proof do not yet link to any internal or external files or resources.
- Some theorem extractions contain errors, and some proofs were overlooked during the extraction phase.
  We plan to rerun proof extraction regularly as new large language models (LLMs) become available
  to address these issues.
- Potential issues include duplicate results and likely simpler proofs that were either unavailable on Wikipedia or not extracted.

## To-do list

The main planned improvements are:

1. Identify the dependency links between results and use them recursively to determine
   the “absolute level” of a proof (including, recursively, the levels needed to understand the proofs of invoked results, rather than only their application) and reveal hidden ways in which a mathematical field enters the proof.
2. Gradually extend the database through suitable additional extraction runs from Wikipedia
   or by using other online resources, such as [ProofWiki](https://proofwiki.org/).
3. Introduce more Noteworthiness categories, for example for results whose statements contain
   concepts from several mathematical fields or whose proofs
   appear in the book [Proofs from THE BOOK](https://www.amazon.de/-/en/Proofs-BOOK-Martin-Aigner/dp/3540404600) by Martin Aigner and Günter M. Ziegler.
4. Incorporate suitable formalizations using a proof assistant such as [Felix](https://github.com/felixprover/felix) (also known as Naproche-ZF), which emphasizes readability.
