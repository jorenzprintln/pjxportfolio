document.addEventListener("DOMContentLoaded",function(){emailjs.init("J8PYga9msHdegeKll"),v(),x(),E(),b()});function v(){const e=document.querySelector(".hamburger"),o=document.querySelector(".nav-menu"),t=document.querySelectorAll(".nav-link");e.addEventListener("click",function(){e.classList.toggle("active"),o.classList.toggle("active")}),t.forEach(s=>{s.addEventListener("click",function(){e.classList.remove("active"),o.classList.remove("active")})}),window.addEventListener("scroll",p),p()}function p(){const e=document.querySelectorAll(".section"),o=document.querySelectorAll(".nav-link");let t="";const s=window.scrollY+100;e.forEach(r=>{const a=r.offsetTop,n=r.clientHeight;s>=a&&s<a+n&&(t=r.getAttribute("id"))}),o.forEach(r=>{r.classList.remove("active"),r.getAttribute("href")===`#${t}`&&r.classList.add("active")})}function b(){const e=document.querySelectorAll(".nav-link"),o=document.querySelectorAll(".hero-buttons a");[...e,...o].forEach(s=>{s.addEventListener("click",function(r){const a=this.getAttribute("href");if(a.startsWith("#")){r.preventDefault();const n=document.querySelector(a);if(n){const l=n.offsetTop-80;window.scrollTo({top:l,behavior:"smooth"})}}})})}function x(){const e=document.querySelectorAll(".section"),o={threshold:.1,rootMargin:"0px 0px -50px 0px"},t=new IntersectionObserver(function(n){n.forEach(l=>{l.isIntersecting&&(l.target.classList.add("visible"),l.target.querySelectorAll(".skill-item").forEach((i,c)=>{setTimeout(()=>{i.style.opacity="1",i.style.transform="translateY(0)"},c*200)}),l.target.querySelectorAll(".project-card").forEach((i,c)=>{setTimeout(()=>{i.style.opacity="1",i.style.transform="translateY(0)"},c*200)}),l.target.querySelectorAll(".contact-method").forEach((i,c)=>{setTimeout(()=>{i.style.opacity="1",i.style.transform="translateX(0)"},c*150)}))})},o);e.forEach(n=>{t.observe(n)}),document.querySelectorAll(".skill-item").forEach(n=>{n.style.opacity="0",n.style.transform="translateY(30px)",n.style.transition="all 0.6s ease"}),document.querySelectorAll(".project-card").forEach(n=>{n.style.opacity="0",n.style.transform="translateY(30px)",n.style.transition="all 0.6s ease"}),document.querySelectorAll(".contact-method").forEach(n=>{n.style.opacity="0",n.style.transform="translateX(-30px)",n.style.transition="all 0.6s ease"})}function E(){const e=document.querySelector(".contact-form");e&&(e.addEventListener("submit",S),e.querySelectorAll("input, textarea").forEach(t=>{t.addEventListener("blur",q),t.addEventListener("input",g)}))}function S(e){e.preventDefault();const o=e.target,t=new FormData(o),s=o.querySelector('button[type="submit"]'),r=t.get("name").trim(),a=t.get("email").trim(),n=t.get("message").trim();if(!k(r,a,n))return;const l=s.textContent;s.textContent="Sending...",s.disabled=!0;const u="service_4zw4aaf",d="template_hezp4ka",f="J8PYga9msHdegeKll",i={from_name:r,from_email:a,message:n,to_name:"Jorenz Pablo"};emailjs.send(u,d,i,f).then(()=>{y("Message sent successfully! I'll get back to you soon.","success"),o.reset()}).catch(c=>{console.error("EmailJS error:",c),y("Failed to send message. Please try again later.","error")}).finally(()=>{s.textContent=l,s.disabled=!1})}function q(e){const o=e.target,t=o.value.trim();return g(e),t?o.type==="email"&&!h(t)?(m(o,"Please enter a valid email address"),!1):!0:(m(o,"This field is required"),!1)}function g(e){const o=e.target,t=o.parentNode.querySelector(".error-message");t&&t.remove(),o.style.borderColor="rgba(255, 255, 255, 0.2)"}function m(e,o){const t=document.createElement("div");t.className="error-message",t.textContent=o,t.style.cssText=`
        color: #ff6b6b;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        animation: fadeIn 0.3s ease;
    `,e.style.borderColor="#ff6b6b",e.parentNode.appendChild(t)}function k(e,o,t){let s=!0;const r=document.querySelector("#name"),a=document.querySelector("#email"),n=document.querySelector("#message");return e||(m(r,"Name is required"),s=!1),o?h(o)||(m(a,"Please enter a valid email address"),s=!1):(m(a,"Email is required"),s=!1),t?t.length<10&&(m(n,"Message must be at least 10 characters long"),s=!1):(m(n,"Message is required"),s=!1),s}function h(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}function y(e,o="info"){const t=document.createElement("div");t.className=`notification notification-${o}`,t.textContent=e,t.style.cssText=`
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${o==="success"?"#4CAF50":o==="error"?"#f44336":"#2196F3"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `,document.body.appendChild(t),setTimeout(()=>{t.style.animation="slideOutRight 0.3s ease",setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},300)},5e3)}function L(){const e=document.createElement("style");e.textContent=`
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `,document.head.appendChild(e)}L();window.addEventListener("scroll",function(){const e=document.querySelector(".navbar");window.scrollY>50?(e.style.background="#000000",e.style.boxShadow="0 2px 20px rgba(255, 255, 255, 0.1)"):(e.style.background="#000000",e.style.boxShadow="none")});function C(){const e=document.querySelector(".hero-title .name-highlight");if(e){const o=e.textContent;e.textContent="";let t=0;const s=setInterval(()=>{e.textContent+=o.charAt(t),t++,t>=o.length&&clearInterval(s)},100)}}setTimeout(C,1e3);
