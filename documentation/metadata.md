# Understanding the assessments in the proof database

Each entry describes a mathematical result and, when available in the source,
one or more proofs. Its assessments help readers judge the result's significance,
the background needed to understand it, and the prerequisites used in a supplied
proof.

This guide defines the assessment criteria for readers and contributors. 

The assessments and subject classifications answer different questions:

| Assessment or classification | Question it answers |
| --- | --- |
| Importance | How much independent mathematical significance does this result have? |
| Philosophical significance | What connection does this result have to philosophical questions, directly or through its role in another result? |
| Mathematical Field | Which broad mathematical subjects does the statement concern? |
| Fields Used Beyond Statement | Which additional subjects does this particular proof use beyond those listed for the statement? |
| Statement level | What background is needed to understand the complete claim? |
| Proof level | What background is needed to understand the claim and follow this particular proof? |

An important theorem can have an elementary statement. A short proof can require
advanced mathematics. An unfamiliar name does not, by itself, make a result
difficult to understand.

## Mathematical importance

Importance concerns the result's independent significance and its value to
professional mathematicians. It does not measure how impressive the terminology
sounds or how difficult the proof is.

| Rating | How to interpret it |
| --- | --- |
| High | Historical significance or lasting mathematical influence can justify this rating. A major theorem retains its significance even when a later theorem gives it a short proof. |
| Medium | A result may merit this rating through independent mathematical significance, even without the historical standing of a major theorem. |
| Low | Routine specializations and straightforward applications of general theorems normally belong here or lower. They may still be useful and worth retaining. |
| Very low | The entry has too little independent content to warrant retention, such as a definitional observation or routine calculation without substantive mathematical interest. This is the database's deletion category. |

For example, the derivative of the identity function and the observation that
zero lies in the kernel of a linear map are rated very low. The transcendence
of particular numbers such as 2 raised to the square root of 2 is rated low as
an application of a more general theorem.

A short proof or a statement about a particular number is not enough to justify
a very low rating. Useful counterexamples and examples that clarify a concept
need individual consideration.

### Equivalent statements and duplicate entries

Assess the mathematical content of the statement independently of its title,
notation, coordinate system, proof method, or proof length. Equivalent
formulations should normally receive the same importance rating. A reformulation
of an important theorem is not a low-importance specialization merely because
its derivation from another formulation is straightforward. For example, the
disk and upper-half-plane formulations of Schwarz–Pick should share a rating.

Duplication is an editorial reason to merge or remove an entry, not by itself a
reason to lower the importance of its mathematical statement. Assess the
significance of the underlying result separately from whether multiple entries
should be retained. In particular, a duplicate of an important theorem should
not be assigned very low importance solely to mark it for deletion.

Distinguish equivalent statements from proper special cases, broader results,
and statements with additional conclusions. A special case may have exceptional
historical significance, so broader scope does not automatically require a higher
importance rating. Such differences call for individual assessment and an
explanation, rather than a rigid ordering by generality.

## Philosophical significance

Some entries include a **Philosophical significance** assessment. Expand its
level label to read an explanation of the result’s connection to questions
about foundations, truth and proof, knowledge, infinity, evidence, randomness,
physical explanation, or collective rationality and fairness.

| Level | How to interpret it |
| --- | --- |
| Major | The result itself establishes a fundamental philosophical limit, incompatibility, or substantial revision of basic intuitions about truth, knowledge, infinity, reality, or collective rationality. |
| Medium | The result has a substantial philosophical connection or explanatory role, but its broader force depends more on interpretation or application, or its reach is more specialized. |
| Minor | The result has a direct but narrower or illustrative philosophical significance, meaningful in its own right. |
| Auxiliary | The result’s philosophical relevance comes chiefly from its supporting role in the proof or proof strategy of another result. The explanation identifies that result and the supporting role. |

These levels concern philosophical significance, rather than technical
difficulty or mathematical fame. A short proof or use in another proof does
not, by itself, make a result auxiliary. Read the explanation alongside the
level: the connection may depend on particular assumptions, and a mathematical
theorem does not by itself settle every philosophical interpretation attached
to it.

Philosophical significance and mathematical importance answer different
questions, but the database links them through an editorial policy: entries
with Major or Medium philosophical significance receive High importance; those
with Minor or Auxiliary significance receive at least Medium importance.

If no philosophical significance assessment is shown, no sufficiently direct
connection was identified in the review. This does not rule out other
philosophical interpretations.

## Mathematical fields

**Mathematical Field** identifies the broad subjects to which the statement
belongs. More than one field may be listed when a result concerns several
subjects.

Each proof’s **Fields Used Beyond Statement** lists additional subjects used in
that particular argument, beyond those already listed for the statement.
Different proofs of the same result may draw on different fields. For example,
the arithmetic–geometric mean inequality is classified under High School
Mathematics, while its proof using the concavity of the logarithm additionally
uses Real analysis.

The categories broadly follow the main subject divisions of the Mathematics
Subject Classification (MSC), with familiar shorter names where convenient.
High School Mathematics is retained as a separate category. These are broad
groupings: two distinct topics may fall within the same field. Consequently, no
additional field being listed does not mean that the proof introduces no new
concepts or techniques.

Fields describe subject matter, not difficulty. Consult **Required topics** for
more specific prerequisites and the statement and proof levels for the
background needed to understand them.

## Understanding statement levels

A statement's level concerns its complete formulation: its objects, definitions,
hypotheses, quantifiers, and conclusion. Understanding a simplified special case
or an intuitive analogy is not sufficient.

### High school only

The statement can be understood using standard US high-school mathematics,
together with locally explained concepts that require only elementary reasoning.
A concept need not appear in the usual school curriculum to qualify. What
matters is whether the reader can understand and use its definition without
substantial additional preparation.

### Undergraduate level

The assumed background is a standard US undergraduate mathematics education:
calculus, linear algebra, introductory real analysis, abstract algebra, and
basic point-set topology. Specialist electives are not assumed.

A small amount of additional background is allowed. Beyond the assumed
undergraduate background, at most about **30 minutes of focused reading** should
be needed to learn the additional prerequisites required to understand the
complete statement. The reader should then be able to explain the claim and make sense
of a basic example. The allowance concerns learning prerequisites; it is not
a time limit for reading a proof or mastering a subject.

Related definitions can sometimes be learned together. Left and right ideals
and the Noetherian condition, for example, can form a small extension of familiar
algebra. A chain of new structures, such as vector bundles, their sections, and
the module structure on those sections, requires substantially more preparation.
The combined burden matters, even when each definition is short.

### Beyond undergraduate level

This rating applies when understanding the full statement requires more
preparation than the undergraduate criterion allows. Neither a graduate subject
label nor an elementary-looking formula settles the question.

Borderline cases remain in this category when the required preparation cannot
confidently fit within the allowance. The accompanying explanation should state
the uncertainty.

### Examples and explanations

The following examples calibrate the database's criteria. They do not classify
whole branches of mathematics.

| Undergraduate level | Beyond undergraduate level |
| --- | --- |
| Finite-dimensional rank–nullity theorem | Yoneda lemma |
| Banach fixed-point theorem for complete metric spaces | Bundle maps inducing module maps on sections |
| Hilbert's basis theorem, including its left/right Noetherian formulation with a central indeterminate | Gauss–Bonnet for geodesic triangles in general Riemannian surfaces |
| | Neighborhood-polar compactness in general topological vector spaces |

A useful borderline example is surjectivity of the norm for finite extensions
of finite fields. Although the norm can be described using a determinant,
understanding the claim also requires field extensions as vector spaces and
finite-field arithmetic. The database conservatively classifies it as beyond
undergraduate level, with the prerequisite uncertainty explained.

The **Level justification** identifies the concepts responsible for a rating.
When an undergraduate rating relies on the reading allowance, the explanation
should say what background is assumed, what must be learned, and why that is a
small extension. **Required topics** lists the background needed for the actual
statement; topics used only in its proof belong with the proof's assessment.

## Understanding proof levels

Each supplied proof is assessed separately. Its level covers understanding the
complete statement and following the argument, including the results it invokes.
It does not measure the difficulty of discovering the proof.

A cited theorem may be accepted without learning its proof. The reader must
still understand what it says, check its hypotheses, and follow how it is
applied. The assessment includes that work. The same educational backgrounds
and conservative allowance for additional prerequisite learning apply as for
statements; there is no 30-minute limit on reading the argument itself.

A correctly assessed proof cannot have a lower level than its statement. Nor
can it be below the level needed to apply any of its dependencies. These are
minimum requirements: the combined prerequisites and reasoning may justify a
higher rating. If a proof appears easier than its statement, both assessments
need review; either one may be mistaken.

When it is uncertain whether a proof's prerequisites fit within the undergraduate
criterion, assign **Beyond undergraduate level** provisionally and explain the
uncertainty in the **Level justification**.

## Results used in a proof

A **dependency** is a result used in the argument. Its description identifies
the claim being used, where it is applied, and how it supports the proof. The
**application level** concerns understanding and applying that result, rather
than proving it from scratch.

References identify supporting passages. A dependency marked as verified has
been checked against a supporting passage; a matching theorem name alone is
not enough. This records the evidence for the identification, not a certificate
of mathematical correctness. Missing information means it has not yet been
established.

## Entries without a supplied proof

A theorem can be included even when its source article contains no proof. Such
an entry retains its standalone statement, importance rating, statement-level
assessment, and source attribution. It has no proof-level assessment.

The note **“No proof is included in the source article”** describes the source.
It does not mean that no proof is known. If the source contains an unusable
argument, the availability note should explain that situation instead.

## Related results

**Related results** identifies other database entries with a recorded
mathematical relationship to the current result.

Each relationship label describes the **listed result relative to the result
you are currently viewing**:

| Label | Meaning |
| --- | --- |
| broader | The listed result is more general or has stronger conclusions than the current result. |
| equivalent | The listed result expresses equivalent mathematical content, possibly in a different formulation. |
| narrower | The listed result is a special case or has weaker conclusions than the current result. |
| related_only | The results have a mathematical connection, but the recorded relationship does not assert equivalence or that either is broader than the other. |

For example, when viewing a special case, its general theorem is labelled
**broader**. When viewing the general theorem, that special case is labelled
**narrower**.

These labels compare mathematical statements. A result used in another result’s
proof is not automatically broader, and a broader result need not have greater
importance or a more difficult proof. Some relationships require mathematical
explanation to recognize.

The list is not exhaustive. An absent link does not mean that two results are
unrelated.
