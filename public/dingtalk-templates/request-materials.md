### Request Materials

{% ifequal info.materials_type "DNA" %}
![](http://chinese-quartet.org/img/dna-materials-pack.33e1193f.png)
{% endifequal %}

{% ifequal info.materials_type "RNA" %}
![](http://chinese-quartet.org/img/rna-materials-pack.13607a42.png)
{% endifequal %}

{% ifequal info.materials_type "Protein" %}
![](http://chinese-quartet.org/img/protein-materials-pack.31e68bef.png)
{% endifequal %}

{% ifequal info.materials_type "Metabolite" %}
![](http://chinese-quartet.org/img/metabolite-materials-pack.e867a0bc.png)
{% endifequal %}

|Key                | Value                      |
|-------------------|----------------------------|
|**Title**          | {{ info.requestor_title }} |
|**UserName**       | {{ info.requestor_name }}  |
|**Organization**   | {{ info.organization }}    |
|**MaterialsType**  | {{ info.materials_type }}  |
|**Tubes**          | {{ info.tubes }}           |
|**Notes**          | {{ info.notes }}           |
