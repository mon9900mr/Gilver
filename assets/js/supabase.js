import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
const configured=SUPABASE_URL.startsWith('https://')&&!SUPABASE_URL.includes('YOUR_PROJECT')&&SUPABASE_ANON_KEY.length>30&&!SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');
export const supabase=configured?createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
export async function requireUser(){if(!supabase)throw new Error('اتصال Supabase هنوز تنظیم نشده است.');const{data:{user},error}=await supabase.auth.getUser();if(error||!user){location.href='login.html';throw new Error('ابتدا وارد حساب شوید.')}const{data:profile,error:pe}=await supabase.from('profiles').select('id,full_name,role,is_blocked').eq('id',user.id).single();if(pe||!profile||profile.is_blocked){await supabase.auth.signOut();location.href='login.html';throw new Error('دسترسی این حساب فعال نیست.')}return{user,profile}}
export async function requireAdmin(){const s=await requireUser();if(s.profile.role!=='admin'){location.href='index.html';throw new Error('دسترسی مدیر لازم است.')}return s}
export function showMessage(n,m,kind='error'){if(!n)return;n.textContent=m;n.dataset.kind=kind;n.hidden=false}
export async function mountAuthHeader(){const h=document.querySelector('.header-actions');if(!h||!supabase)return;const{data:{user}}=await supabase.auth.getUser();const a=document.createElement('a');a.className='account-link';a.href=user?'account.html':'login.html';a.textContent=user?'حساب من':'ورود';h.prepend(a)}
document.addEventListener('DOMContentLoaded',mountAuthHeader);
