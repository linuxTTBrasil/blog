---
layout: page
title: Categorias
---
<div id="wrapper">
 <select id="select" class="form-select">
  <option value="" selected>Selecione uma categoria</option>
  </select>
    <div   class="posts filter" id="main"/>
</div>
<script id="selectOp">
addCategoriesToSelectCategoriesElement("select")
renderPostsByCategory("","main");
    document.getElementById("select").addEventListener("change", function(){
        let categoriaAtual = this.value;
        document.getElementById("main").innerHTML = "";
        renderPostsByCategory(categoriaAtual,"main");
    })
</script>
