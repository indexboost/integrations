# ASP.NET (C#) Integration

**Categoria:** Backend Framework (NuGet)
**Prioridade:** Fase 4 — Complementar
**Código Renderfy necessário:** ✅ Sim — pacote NuGet `Renderfy.AspNet`

## Descrição

ASP.NET é o framework web da Microsoft. A integração é um `DelegatingHandler` ou middleware que detecta crawlers.

## Setup do usuário

```bash
dotnet add package Renderfy.AspNet
```

```csharp
// Program.cs
builder.Services.AddRenderfy(options =>
{
    options.Token = builder.Configuration["IndexBoost:Token"];
});

app.UseRenderfy();
```

## Arquivos a criar

```
packages/renderfy-aspnet/                     — NuGet package
  Renderfy.AspNet.csproj
  RenderfyMiddleware.cs
  CrawlerDetector.cs
  RenderfyOptions.cs
  ServiceCollectionExtensions.cs
  README.md
docs/docs/integrations/aspnet.md             — Documentação Docusaurus
```

## Tarefas

- [ ] Criar pacote NuGet `Renderfy.AspNet`
- [ ] Implementar ASP.NET middleware
- [ ] Implementar `CrawlerDetector`
- [ ] Extension methods para DI
- [ ] Testes com xUnit
- [ ] Publicar no NuGet
- [ ] Documentação Docusaurus
