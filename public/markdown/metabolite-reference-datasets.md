<img src="https://img.shields.io/badge/Version-v20210909-blue"/>

### How to download the reference datasets? 

#### Download with Browser
| Name                        | Link                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| RefDT_D6toD5.csv | <a href="//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_D6toD5.csv" target="_blank">Download</a> |
| RefDT_F7toD5.csv | <a href="//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_F7toD5.csv" target="_blank">Download</a> |
| RefDT_F7toD6.csv | <a href="//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_F7toD6.csv" target="_blank">Download</a> |
| RefDT_M8toD5.csv | <a href="//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_M8toD5.csv" target="_blank">Download</a> |
| RefDT_M8toD6.csv | <a href="//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_M8toD6.csv" target="_blank">Download</a> |
| RefDT_M8toF7.csv | <a href="//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_M8toF7.csv" target="_blank">Download</a> |

#### Download with wget

```text
//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_D6toD5.csv
//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_F7toD5.csv
//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_F7toD6.csv
//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_M8toD5.csv
//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_M8toD6.csv
//reference-dataset.chinese-quartet.org/stable/v20210909/Metabolite/RefDT_M8toF7.csv
```


### Description

A reference dataset was built with the following steps in the workflow. We first filter out low-quality metabolites with CV greater than 25% and the number of replicates less two in each batch. Subsequently, only metabolites that were jointly detected in at least two datasets were retained, and the ratio results of the six sample combinations in each batch of these metabolites were calculated. Taking the total CV <10% as the criterion for consensual results between datasets, we searched for metabolites agreed by at least 2 datasets in each sample combination and took the average ratio of the largest agreed datasets in these metabolites as the consensual relative reference dataset. With adding nominal ratios of spike-ins of sample pairs, which is 1, we constructed 6 relative reference datasets containing only 68 metabolites in total.

<img src="//reference-dataset.chinese-quartet.org/images/metabolite-reference-datasets-overview.png" style="display: block; margin: 0 auto;" width="60%"/>

<p style="text-align: center;">Figure 1. Flowchart of building a reference dataset.</p>