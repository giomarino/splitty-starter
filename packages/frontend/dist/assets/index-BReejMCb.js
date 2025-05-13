(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const a of e.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function s(t){if(t.ep)return;t.ep=!0;const e=r(t);fetch(t.href,e)}})();async function p(){var o;try{const n=await fetch("https://ymb44na93d.execute-api.eu-central-1.amazonaws.com/order");if(!n.ok)throw new Error("Errore nel caricamento dei dati");const r=await n.json(),s=document.getElementById("ordersTableBody"),t=document.querySelector("thead tr");(o=t.querySelector("th:last-child"))!=null&&o.textContent.includes("Azioni")||t.insertAdjacentHTML("beforeend",`
              <th class="px-6 py-3 text-left text-sm font-semibold text-primary-800">Azioni</th>
            `),s.innerHTML=r.map(e=>{const a=luxon.DateTime.fromMillis(e.created_at).setZone("Europe/Rome").toFormat("dd/MM/yyyy HH:mm:ss"),h=luxon.DateTime.fromMillis(e.updated_at).setZone("Europe/Rome").toFormat("dd/MM/yyyy HH:mm:ss"),B=(e.amount/100).toLocaleString("it-IT",{style:"currency",currency:"EUR"});return`
                <tr class="border-t border-primary-100 hover:bg-primary-50">
                  <td class="px-6 py-4 text-sm text-primary-800 font-mono">
                    <span class="clickable" data-order='${JSON.stringify(e)}'>${e.order_id}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${e.status==="pending"?"bg-yellow-100 text-yellow-800":e.status==="completed"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}">
                      ${e.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-primary-800">${e.name}</td>
                  <td class="px-6 py-4 text-sm text-primary-800">${B}</td>
                  <td class="px-6 py-4 text-sm text-primary-600">${a}</td>
                  <td class="px-6 py-4 text-sm text-primary-600">${h}</td>
                  <td class="px-6 py-4 text-sm">
                    <div class="actions-cell">
                      <button 
                        class="action-button pay" 
                        data-order-id="${e.order_id}"
                        data-order='${JSON.stringify(e)}'
                        title="Effettua pagamento"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
                          />
                        </svg>
                      </button>
                      <button 
                        class="action-button delete" 
                        data-order-id="${e.order_id}"
                        title="Elimina ordine"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `}).join(""),s.querySelectorAll(".clickable").forEach(e=>{e.addEventListener("click",()=>{const a=JSON.parse(e.dataset.order);H(a)})}),s.querySelectorAll(".delete").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.orderId;F(a)})}),s.querySelectorAll(".pay").forEach(e=>{e.addEventListener("click",()=>{const a=JSON.parse(e.dataset.order);R(e.dataset.orderId,a)})})}catch(n){const r=document.getElementById("ordersTableBody");r.innerHTML=`
            <tr>
              <td colspan="6" class="px-6 py-4 text-center text-red-600">
                Errore nel caricamento dei dati: ${n.message}
              </td>
            </tr>
          `}}const i=document.getElementById("newOrderDialog"),I=document.getElementById("newOrderBtn"),M=document.getElementById("closeDialog"),O=document.getElementById("cancelBtn"),v=document.getElementById("newOrderForm");function _(){i.classList.add("open"),document.body.style.overflow="hidden"}function f(){i.classList.remove("open"),document.body.style.overflow="",v.reset()}I.addEventListener("click",_);M.addEventListener("click",f);O.addEventListener("click",f);i.addEventListener("click",o=>{o.target===i&&f()});v.addEventListener("submit",async o=>{o.preventDefault();const n=new FormData(v),r=Math.round(parseFloat(n.get("amount"))*100);try{if((await fetch("https://ymb44na93d.execute-api.eu-central-1.amazonaws.com/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n.get("name"),amount:r})})).status!==201)throw new Error("Errore nella creazione dell'ordine");f(),await p();const t=document.createElement("div");t.className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg",t.textContent="Ordine creato con successo!",document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}catch(s){alert("Errore: "+s.message)}});const l=document.getElementById("orderDetailsDialog"),k=document.getElementById("closeDetailsDialog"),S=document.getElementById("orderDetails");function C(o){const n=luxon.DateTime.fromMillis(o.created_at).setZone("Europe/Rome").toFormat("dd/MM/yyyy HH:mm:ss"),r=luxon.DateTime.fromMillis(o.updated_at).setZone("Europe/Rome").toFormat("dd/MM/yyyy HH:mm:ss"),s=o.creation_email_sent_at?luxon.DateTime.fromMillis(o.creation_email_sent_at).setZone("Europe/Rome").toFormat("dd/MM/yyyy HH:mm:ss"):"Non inviata",t=(o.amount/100).toLocaleString("it-IT",{style:"currency",currency:"EUR"}),e={...o,created_at:n,updated_at:r,creation_email_sent_at:s,amount:t};return Object.entries(e).map(([a,h])=>`<div class="mb-2">
            <span class="json-key">${a}:</span> ${h}
          </div>`).join("")}function H(o){S.innerHTML=C(o),l.classList.add("open"),document.body.style.overflow="hidden"}function D(){l.classList.remove("open"),document.body.style.overflow=""}k.addEventListener("click",D);l.addEventListener("click",o=>{o.target===l&&D()});const m=document.getElementById("deleteConfirmDialog"),P=document.getElementById("closeDeleteDialog"),T=document.getElementById("cancelDelete"),$=document.getElementById("confirmDelete");let u=null;function F(o){u=o,m.classList.add("open"),document.body.style.overflow="hidden"}function g(){m.classList.remove("open"),document.body.style.overflow="",u=null}async function A(){if(u)try{if((await fetch(`https://ymb44na93d.execute-api.eu-central-1.amazonaws.com/order/${u}`,{method:"DELETE"})).status!==204)throw new Error("Errore durante l'eliminazione dell'ordine");g(),await p();const n=document.createElement("div");n.className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg",n.textContent="Ordine eliminato con successo!",document.body.appendChild(n),setTimeout(()=>{n.remove()},3e3)}catch(o){alert("Errore: "+o.message)}}P.addEventListener("click",g);T.addEventListener("click",g);m.addEventListener("click",o=>{o.target===m&&g()});$.addEventListener("click",A);const b=Stripe("pk_test_51RNdZY4UOaEyPusSH0QUdExVUFimZ9ZhtI9wsbIctL5rghmlRAHyKgvee2gSWeEwufWOCxBnSfV6QmqWAMuWxmPj00nzx3Umrn"),N=b.elements(),d=N.create("card",{style:{base:{fontSize:"16px",color:"#1f2937","::placeholder":{color:"#6b7280"}}}}),y=document.getElementById("paymentConfirmDialog"),z=document.getElementById("closePaymentDialog"),j=document.getElementById("cancelPayment"),x=document.getElementById("confirmPayment"),c=document.getElementById("payment-form"),L=x.querySelector(".spinner");let w=null;function R(o,n){w=n,y.classList.add("open"),document.body.style.overflow="hidden",d.isMount||(d.mount("#card-element"),d.isMount=!0),d.on("change",function(r){const s=document.getElementById("card-errors"),t=document.getElementById("confirmPayment");r.error?(s.textContent=r.error.message,t.disabled=!0):(s.textContent="",t.disabled=!1);const e=document.querySelector(".stripe-element");r.focused?e.classList.add("focused"):e.classList.remove("focused"),r.error?e.classList.add("invalid"):e.classList.remove("invalid")})}function E(){y.classList.remove("open"),document.body.style.overflow="",w=null,c.reset(),d.clear()}c.addEventListener("submit",async function(o){o.preventDefault(),c.classList.add("payment-processing"),L.classList.remove("hidden"),x.disabled=!0;try{const{paymentMethod:n,error:r}=await b.createPaymentMethod({type:"card",card:d});if(r)throw new Error(r.message);const{error:s}=await b.confirmCardPayment(w.stripe_payment_intent_client_secret,{payment_method:n.id});if(s)throw new Error(s.message);E(),await p();const t=document.createElement("div");t.className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg",t.textContent="Pagamento completato con successo!",document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}catch(n){const r=document.getElementById("card-errors");r.textContent=n.message||"Si è verificato un errore durante il pagamento. Riprova."}finally{c.classList.remove("payment-processing"),L.classList.add("hidden"),x.disabled=!1}});z.addEventListener("click",E);j.addEventListener("click",E);y.addEventListener("click",o=>{o.target===y&&E()});document.addEventListener("DOMContentLoaded",p);
