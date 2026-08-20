# Método Glúteos Brasileños — funil completo

Funil de 3 etapas em HTML/CSS/JS puro. Sem build, sem dependências.
Sobe direto no GitHub Pages, Netlify, Vercel ou qualquer hospedagem estática.

```
index.html    → pré-quiz (hero + coach + provas) e quiz de 10 etapas
vsl.html      → página da VSL, com botão que libera no tempo que você definir
oferta.html   → página de vendas com checkout Hotmart
```

Fluxo: `index.html` → quiz → loading → `vsl.html` → `oferta.html` → checkout.

---

## 1. O que você precisa configurar antes de subir tráfego

| Onde | Linha | O que trocar |
|---|---|---|
| `oferta.html` | `var CHECKOUT` | Seu link real da Hotmart |
| `oferta.html` | `var SUPPORT_SLOTS` | Quantas alunas seu time atende de verdade por semana |
| `oferta.html` | `var RESERVE_MINUTES` / `DEADLINE_ISO` | Tempo de reserva ou data real de fim da campanha |
| `vsl.html` | `<div class="vsl__ratio">` | Cole aqui o embed da sua VSL |
| `vsl.html` | `var REVEAL_SECONDS` | Minuto em que a VSL faz a oferta |
| `js/social-proof.js` | `var SALES` | Vendas **reais** (nome + cidade). Vazio = notificação não aparece |
| `index.html` | bloco do pixel | Seu Pixel ID da Meta (o bloco está comentado) |
| todas | `terminos.html`, `privacidad.html` | Criar as duas páginas — a Hotmart exige |

---

## 2. Deploy no GitHub Pages

```bash
git init
git add .
git commit -m "funil gluteos brasilenos"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

Depois: **Settings → Pages → Source: main / (root)**.
A URL fica `https://SEU-USUARIO.github.io/SEU-REPO/`.

Para domínio próprio, crie um arquivo `CNAME` na raiz com o domínio dentro.

---

## 3. Como o funil carrega os dados entre páginas

`js/funnel.js` cuida de duas coisas:

**Respostas do quiz** — ficam em `sessionStorage` sob `gb_answers`. Se quiser
personalizar a página de oferta com o que a lead respondeu:

```js
var a = Funnel.getAnswers();
// { objetivo:'volumen', edad:'30-39', lugar:'casa', tiempo:'10-20', score:91, ... }
```

**UTMs** — capturados na primeira visita e reinjetados em todo link com
`data-keep-utm`, incluindo o checkout. Sem isso você perde a origem da venda
no relatório da Hotmart.

---

## 4. Como o score do quiz é calculado

O número não é decorativo: sai das respostas de tempo diário, local de treino,
experiência anterior e dias por semana (`WEIGHTS` em `js/quiz.js`). Se a lead
mudar a resposta, o número muda. Varia entre 60 e 98.

A etapa de idade define o perfil mostrado no resultado (`PROFILES`), com foco
de treino diferente para cada faixa.

---

## 5. Checklist antes de ligar o tráfego

- [ ] Link do checkout trocado e testado numa compra de teste
- [ ] Pixel instalado e disparando (Meta Events Manager → Testar eventos)
- [ ] Embed da VSL colado e tocando no celular
- [ ] `terminos.html` e `privacidad.html` publicadas
- [ ] Garantia da página (45 dias) igual à configurada no produto Hotmart
- [ ] Preço "de $97" só aparece se você realmente já vendeu a $97
- [ ] Autorização de uso de imagem de cada foto antes/depois em `assets/img/prova*`
- [ ] `SALES` em `social-proof.js` com vendas reais, ou vazio
- [ ] Testado num celular de verdade, no 4G, não só no navegador

---

## 6. Imagens

Todas convertidas para WebP e redimensionadas. Os dois GIFs viraram WebP
animado: **17 MB → 2,2 MB no total**. Se trocar alguma imagem, passe pelo
mesmo processo — cada MB extra custa conversão em tráfego pago no celular.

---

## 7. Paleta

```css
--magenta:      #EC0F8C   /* rosa principal, tirado das fotos */
--magenta-soft: #FF3DA6
--magenta-deep: #A3096A
--purple:       #8B2FD6
--purple-deep:  #4C1470   /* fundo dos heros */
--cream:        #FFF4FB
--ink:          #1A0620

/* wordmark bandeira do Brasil */
--br-green:  #009C3B
--br-yellow: #FFDF00
```

Tipografia: **Anton** nos títulos (bem parecida com a das suas artes) e
**Figtree** no corpo.
