const DEFAULT_ADMIN_PASSWORD = '123456';
const getAdminPassword = () => localStorage.getItem('engAdminPassword') || DEFAULT_ADMIN_PASSWORD;

const defaultData = {
name:'ENG/MOHAMED WALED',
phone:'01036537131',
text:'نقدم خدمات رقمية ومساعدة تقنية تركز على الأمان والخصوصية، مع إرشاد واضح وخطوات رسمية لحماية حساباتك واستعادة الوصول إليها.',
services:[
{icon:'🛡️',title:'تأمين المواقع الإلكترونية',desc:'مراجعة إعدادات الأمان الأساسية وتقوية حماية الموقع بالتنسيق مع مالكه.'},
{icon:'🔎',title:'فحص أمان المواقع بإذن المالك',desc:'فحص أمني مصرح به للموقع، وتوضيح نقاط الضعف المكتشفة وطرق معالجتها.'},
{icon:'🔐',title:'حماية الحسابات الشخصية',desc:'إرشادات لتفعيل المصادقة الثنائية، ومراجعة إعدادات الخصوصية، وتأمين البريد والحسابات.'},
{icon:'🧹',title:'إزالة البرمجيات الضارة',desc:'المساعدة في فحص الأجهزة والمواقع المصابة وتنظيفها وتحسين إجراءات الحماية.'},
{icon:'📡',title:'تأمين الشبكات والأجهزة',desc:'مراجعة إعدادات الراوتر والشبكة والأجهزة، وتقديم خطوات عملية لتقليل مخاطر الاختراق.'},
{icon:'💾',title:'النسخ الاحتياطي وحماية البيانات',desc:'إعداد خطة نسخ احتياطي آمنة وإرشادك إلى طرق حفظ ملفاتك وتقليل فقدان البيانات.'}
]
};

let data;
try{
data=JSON.parse(localStorage.getItem('engSiteData'))||defaultData;
}catch(e){
data=defaultData;
}
// إضافة الخدمات الافتراضية مرة واحدة إذا لم تكن هناك خدمات محفوظة
if(!Array.isArray(data.services)) data.services=[];
if(!localStorage.getItem('engServicesSeededV2')){
  if(data.services.length===0){
    data.services=defaultData.services.map(service=>({...service}));
    localStorage.setItem('engSiteData',JSON.stringify(data));
  }
  localStorage.setItem('engServicesSeededV2','1');
}

const $=id=>document.getElementById(id);

function wa(){
return 'https://wa.me/2'+data.phone.replace(/\D/g,'').replace(/^2/,'');
}

function escapeHtml(v){
return String(v).replace(/[&<>"']/g,c=>({
'&':'&amp;',
'<':'&lt;',
'>':'&gt;',
'"':'&quot;',
"'":'&#39;'
}[c]));
}

function renderServiceManager(){
const box=$('serviceManager');
if(!box)return;

box.innerHTML=data.services.length
?data.services.map((s,i)=>`
<div class="service-row">
<span>${escapeHtml(s.title)}</span>
<button type="button" class="delete-service" data-delete-index="${i}">حذف الخدمة</button>
</div>`).join('')
:'<p class="small">لا توجد خدمات حالياً. يمكنك إضافة خدمة جديدة من الأعلى.</p>';
}

function render(){
$('heroName').textContent=data.name;
$('footerName').textContent=data.name;
$('heroText').textContent=data.text;
$('phoneText').textContent=data.phone;

['navWhats','heroWhats','contactWhats'].forEach(id=>{
$(id).href=wa();
});

$('serviceGrid').innerHTML=data.services.length ? data.services.map(s=>`
<article class="card">
<div class="ico">${escapeHtml(s.icon||'✦')}</div>
<h3>${escapeHtml(s.title)}</h3>
<p>${escapeHtml(s.desc)}</p>
</article>`).join('') : '<div class="card"><h3>لا توجد خدمات حالياً</h3><p>سيتم إضافة الخدمات قريباً.</p></div>';

renderServiceManager();
$('year').textContent=new Date().getFullYear();
}

render();

// فتح صفحة الطلب عند الضغط على أي خدمة
let selectedServiceTitle = '';
$('serviceGrid').addEventListener('click',e=>{
  const card=e.target.closest('.card');
  if(!card)return;
  selectedServiceTitle=card.querySelector('h3')?.textContent?.trim()||'الخدمة';
  $('orderTitle').textContent='طلب خدمة: '+selectedServiceTitle;
  $('serviceOrderScreen').classList.add('show');
  $('customerProblem').focus();
});
$('backToServices').onclick=()=>{
  $('serviceOrderScreen').classList.remove('show');
};
$('sendServiceWhats').onclick=()=>{
  const problem=$('customerProblem').value.trim();
  if(!problem){
    alert('من فضلك اكتب تفاصيل المشكلة أو طلبك');
    $('customerProblem').focus();
    return;
  }
  const message=`طلب خدمة جديدة\nالخدمة: ${selectedServiceTitle}\nتفاصيل المشكلة: ${problem}`;
  window.open(wa()+'?text='+encodeURIComponent(message),'_blank');
};

$('openAdmin').onclick=()=>{
$('adminModal').classList.add('show');
};

$('closeAdmin').onclick=()=>{
$('adminModal').classList.remove('show');
};

$('loginBtn').onclick=()=>{
if($('pass').value===getAdminPassword()){
$('loginBox').classList.add('hidden');
$('panel').classList.remove('hidden');
$('editName').value=data.name;
$('editPhone').value=data.phone;
$('editText').value=data.text;
}else{
alert('كلمة المرور غير صحيحة');
}
};

$('changePassBtn').onclick=()=>{
const current=$('currentPass').value;
const next=$('newPass').value;
const confirmNext=$('confirmPass').value;

if(current!==getAdminPassword()){
alert('كلمة المرور الحالية غير صحيحة');
return;
}

if(next.length<6){
alert('كلمة المرور الجديدة يجب أن تكون 6 أحرف أو أرقام على الأقل');
return;
}

if(next!==confirmNext){
alert('تأكيد كلمة المرور الجديدة غير مطابق');
return;
}

localStorage.setItem('engAdminPassword',next);
$('currentPass').value='';
$('newPass').value='';
$('confirmPass').value='';
alert('تم تغيير كلمة المرور بنجاح');
};

$('saveBtn').onclick=()=>{
data.name=$('editName').value.trim()||data.name;
data.phone=$('editPhone').value.trim()||data.phone;
data.text=$('editText').value.trim()||data.text;
localStorage.setItem('engSiteData',JSON.stringify(data));
render();
alert('تم حفظ التعديلات على هذا المتصفح');
};

$('addService').onclick=()=>{
let title=$('newTitle').value.trim();
let desc=$('newDesc').value.trim();

if(!title||!desc){
alert('اكتب اسم الخدمة ووصفها');
return;
}

data.services.push({icon:'✦',title,desc});
localStorage.setItem('engSiteData',JSON.stringify(data));
render();
$('newTitle').value='';
$('newDesc').value='';
};

$('serviceManager').onclick=e=>{
const btn=e.target.closest('[data-delete-index]');
if(!btn)return;

const i=Number(btn.dataset.deleteIndex);
if(!Number.isInteger(i)||i<0||i>=data.services.length)return;

const title=data.services[i].title;
if(!confirm(`هل تريد حذف خدمة «${title}»؟`))return;

data.services.splice(i,1);
localStorage.setItem('engSiteData',JSON.stringify(data));
render();
};

$('logoutBtn').onclick=()=>{
$('panel').classList.add('hidden');
$('loginBox').classList.remove('hidden');
$('pass').value='';
};

// خلفية متحركة
(()=>{
const canvas=document.getElementById('matrixBg');
const ctx=canvas.getContext('2d');
const chars='01アイウエオカキクケコサシスセソ<>[]{}#$%';
let drops=[],fontSize=16,columns=0;

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
columns=Math.ceil(canvas.width/fontSize);
drops=Array(columns).fill(1);
}

function draw(){
ctx.fillStyle='rgba(7,11,20,0.12)';
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.fillStyle='#24ff88';
ctx.font=fontSize+'px monospace';

for(let i=0;i<drops.length;i++){
const ch=chars[Math.floor(Math.random()*chars.length)];
ctx.fillText(ch,i*fontSize,drops[i]*fontSize);

if(drops[i]*fontSize>canvas.height && Math.random()>.975){
drops[i]=0;
}
drops[i]++;
}

requestAnimationFrame(draw);
}

window.addEventListener('resize',resize);
resize();
draw();
})();
