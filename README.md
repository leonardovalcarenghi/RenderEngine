
# Introdução
**RenderEngine** é um motor de renderização de componentes utilizando VanillaJS no lado do cliente.


> **Desenvolvedor**: Leonardo Valcarenghi
> <br/>
> **Versão**: 1.0 _beta_
> <br/>
> [Site do Desenvolvedor](https://leonardovalcarenghi.com.br)

-----

<br/>
<br/>

# Vamos Começar

## Instância do RenderEngine

Para utilização do RenderEngine, recomendamos instancia-lo globalmente na sua aplicação:

```js

    var RenderEngine = new RenderEngine();

    window.onload = function(){
        // funções de inicialização.
    }

```

# Escopos
Cada componente renderizado no DOM é único, exclusivo e contém seu próprio escopo interno.

Para acessar, você consegue utilizar o _**$SCOPE**_ dentro de seu componente.

<br/>
<br/>
<br/>

# View
O _HtmlElement_ do seu componente fica disponível no _**$VIEW**_.


<br/>

## Blocos de Renderização ( RenderBlock )
O _RenderBlock_ é um pequeno bloco de código que você utiliza para montar informações dentro do componente, como se estivesse usando um _template string_ do JavaScript.

Para utilizar é simples, confira:

```html
<component name="nome-do-componente">

    <script>
        var pessoa = "Leonardo";
    </script>

    <view attr1="" attr2="" attr3="">
        <label>Seja bem-vindo(a) {{ pessoa }}.</label>
    </view>

</component>
````

Note que usamos duas chaves para abrir e fechar o bloco de renderização, dentro dele escrevemos o nome da váriavel "pessoa".

Isso faz que o compilador do RenderEngine entenda que é um RenderBlock para "escrever" o valor da variável dentro do espaço.

<br/>
<br/>
<br/>

# Componentes

## Estrutura dos Componentes

A estrutura do componente deve seguir um padrão simples dentro de um arquivo de tipo **HTML**.

Crie a tag base chamada _**component**_, dentro é obrigatório conter a tag _**view**_.

Caso queira configurar funções internas, adicione a tag _**script**_.

Caso queira personalizar seu componente, adicione a tag _**style**_.

```html

<component name="nome-do-componente">

    <script>
        // Funções internas do componente (opcional)
    </script>

    <view attr1="" attr2="" attr3="">
        <!-- HTML do componente -->
    </view>

    <style>
        /* CSS do componente (opcional) */
    </style>

</component>

```

A tag _component_ precisa conter um nome.

A tag _view_ pode conter atributos que serão renderizados no DOM.


## Importar Componentes

Para importar seus componentes utilize o método **ImportComponent** passando como parâmetro o caminho relativo do arquivo do componente.

```js

    const component = await Render.ImportComponent("/component");

```

Note que utilizamos o _await_, ele é obrigatório poís estamos usando o lado do cliente para montar os componentes em tela.

## Renderizar Componentes
Para renderizar um componente simples, sem passar nenhuma informação para o escopo, utilize:
```js

    const container = document.querySelector("#container");     // Container onde o componente será adicionado.
    component.render(container);                                // Renderizar componente.

```

## Renderizar Componentes ( com objects )
Para renderizar um componente passando um _object_ para montar as informações, utilize:
```js

    const container = document.querySelector("#container");     // Container onde o componente será adicionado.
    const data = { nome: "render engine" };                     // Objeto a ser passado para o escopo do componente.
    component.render(container, data);                          // Renderizar componente.

```

## Renderizar Componentes ( com arrays )
Para renderizar vários componentes com informações, passe uma _array_ ao invés de um _object_.

```js

    const container = document.querySelector("#container");     // Container onde o componente será adicionado.
    const list = [
        { item: "01" },
        { item: "02" },
        { item: "03" }
    ];
    component.render(container, list);

```

## Renderizar Componentes dentro de Componentes

<br/>
<br/>
<br/>




# Funções Internas

## $RENDER
Função que permite renderizar outros componentes dentro do componente pai.
```html

<component name="nome-do-componente">

    <view>
        <h1>Título</h1>
        <p>Texto</p>
        {{ 
            $RENDER("/componentes/filho", $SCOPE) 
        }}
    </view>

</component>

```


## $MAP
Função que mapeia uma array para retornar algo novo.

## $IF
Função _**$IF**_ é uma função para montar condições dentro dos _RenderBlocks_.

```html

<component name="nome-do-componente">

    <view>
        <h1>Título</h1>
        <p>Texto</p>
        {{ 
            $IF(true == true, "escreva isso", "caso contrario, escreva isso") 
        }}
    </view>

</component>

```

## $CONSOLE
Quando você precisar escrever no console no meio do seu componente, mas não quer que ele "escreva" nada no html do componente, 
utilize o método _**$CONSOLE**_


```html

<component name="nome-do-componente">

    <view>
        <h1>Título</h1>
        <p>Texto</p>
        {{ 
            $CONSOLE("Console do componente:", $scope)
        }}
    </view>

</component>

```

<br/
<br/>
<br/>

# Callbacks


## componentDidMount
Quando você precisa obter um evento informando que o componente foi montado, utilize a função de callback _**componentDidMount**_

```js

    $SCOPE.componentDidMount = function(){
        console.log("O componente foi montado.");
    }

```