// GILVER lightweight browser database (LocalStorage).
// Data stays in this browser profile only; this is NOT a secure shared server database.
const PREFIX='gilver-db-v1:';
const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(PREFIX+key));return v??fallback}catch{return fallback}};
const write=(key,value)=>localStorage.setItem(PREFIX+key,JSON.stringify(value));
const id=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const log=(action,details={})=>{const logs=read('logs',[]);logs.unshift({id:id(),action,details,at:new Date().toISOString(),by:current()?.email||'guest'});write('logs',logs.slice(0,500))};
const current=()=>{const sid=read('session',null);return sid?read('users',[]).find(u=>u.id===sid)||null:null};
async function hashPassword(password,salt){const enc=new TextEncoder(),key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:120000,hash:'SHA-256'},key,256);return [...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,'0')).join('')}
export const DB={
 getUser:()=>{const u=current();return u?{id:u.id,name:u.name,email:u.email,role:u.role,banned:u.banned}:null},
 getUsers:()=>read('users',[]).map(({id,name,email,role,banned,createdAt})=>({id,name,email,role,banned,createdAt})),
 async signup({name,email,password}){email=email.trim().toLowerCase();if(!name.trim()||!email||password.length<8)throw Error('اطلاعات را کامل وارد کن؛ رمز باید حداقل ۸ کاراکتر باشد.');const users=read('users',[]);if(users.some(u=>u.email===email))throw Error('این ایمیل قبلاً ثبت شده است.');const salt=id()+id(),role=users.length===0?'owner':'customer';const user={id:id(),name:name.trim(),email,salt,passwordHash:await hashPassword(password,salt),role,banned:false,createdAt:new Date().toISOString()};users.push(user);write('users',users);write('session',user.id);log('signup',{email,role});return DB.getUser()},
 async login({email,password}){email=email.trim().toLowerCase();const user=read('users',[]).find(u=>u.email===email);if(!user||user.passwordHash!==await hashPassword(password,user.salt))throw Error('ایمیل یا رمز عبور اشتباه است.');if(user.banned)throw Error('این حساب مسدود شده است.');write('session',user.id);log('login');return DB.getUser()},
 logout(){log('logout');localStorage.removeItem(PREFIX+'session')},
 isOwner:()=>current()?.role==='owner',
 getProducts(defaults=[]){const saved=read('products',null);return saved===null?defaults:saved},
 saveProduct(product){const user=current();if(!user||user.banned||!['owner','admin','seller'].includes(user.role))throw Error('اجازه انجام این کار را نداری.');const items=DB.getProducts([]);const p={...product,id:product.id||id(),updatedAt:new Date().toISOString()};const i=items.findIndex(x=>x.id===p.id);i<0?items.unshift(p):items.splice(i,1,p);write('products',items);log('product_saved',{id:p.id,name:p.name});return p},
 deleteProduct(productId){if(!['owner','admin'].includes(current()?.role))throw Error('فقط مالک یا مدیر می‌تواند محصول را حذف کند.');write('products',DB.getProducts([]).filter(p=>p.id!==productId));log('product_deleted',{id:productId})},
 updateUser(userId,changes){if(!DB.isOwner())throw Error('فقط مالک سایت می‌تواند نقش کاربران را تغییر دهد.');const users=read('users',[]);const target=users.find(u=>u.id===userId);if(!target)throw Error('کاربر پیدا نشد.');if(target.role==='owner')throw Error('نقش مالک قابل تغییر نیست.');if(changes.role&&!['admin','seller','customer'].includes(changes.role))throw Error('نقش نامعتبر است.');Object.assign(target,changes);write('users',users);log('user_updated',{id:userId,changes})},
 getLogs:()=>read('logs',[]),
 getStats(){return{users:read('users',[]).length,products:DB.getProducts([]).length,orders:read('orders',[]).length}},
 saveOrder(order){const orders=read('orders',[]);const value={...order,id:id(),createdAt:new Date().toISOString()};orders.unshift(value);write('orders',orders);log('order_saved',{id:value.id});return value},
 getOrders:()=>read('orders',[])
};
