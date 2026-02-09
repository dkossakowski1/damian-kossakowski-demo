Solutions Engineer Hiring Assignment Answers

Q1. 

Hi George,

It's totally normal to feel overwhelmed at first. Searches rely on a few core concepts and once you understand those everything else gets easier.

A record is a single item you want people to be able to find. For example, one product is one record. Each record has fields (attributes) like name, description, category, price, etc. Those fields are what Algolia uses to match and rank results when someone searches.

Indexing is the process of keeping Algolia in sync with your data. You push records into an index and Algolia stores them and prepares them for fast, high-quality searches. Typically, you index once for the initial setup, and then continue indexing whenever records are added or updated.

For Custom Ranking, I like to think of it as a tie breaker for what you want customers to find first. Algolia will still go by relevance first but Custom Ranking refines the ordering when multiple results match the search equally well. 

Thanks,
Damian

Q2. 

Hi Matt,

Thank you for your feedback. I understand, during rapid iteration you want those actions to be quick, but the extra steps are also there to help prevent accidental changes, especially when teams are moving fast. 
If you tell me your current workflow, I can recommend the quickest approach and share the exact steps.

Thanks,
Damian

Q3.

Hi Leo,
It depends on your platform and how advanced you want the search experience to be, but most teams can start with a simple setup and build from there.
High level process:

1.	Choose what you want to search (products, articles, etc.)
2.	Send that data to Algolia as records in an index
3.	Configure relevance (fields, filters, ranking, etc.)
4.	Add the search UI (search box, results, filters)
5.	Test and tune

If you tell me what platform you’re using and what you want users to search, I can recommend the quickest setup.

Thanks,
Damian


