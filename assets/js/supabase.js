import{DB}from'./database.js';
export const supabase=null;
export function showMessage(node,message,kind='error'){if(!node)return;node.textContent=message;node.dataset.kind=kind;node.hidden=false}
export async function requireUser(){const user=DB.getUser();if(!user){location.href='login.html';throw Error('ابتدا وارد حساب شو.')}if(user.banned){DB.logout();location.href='login.html';throw Error('این حساب مسدود شده است.')}return{user,profile:{...user,role:user.role==='owner'?'admin':user.role,is_blocked:user.banned}}}
export async function requireAdmin(){const session=await requireUser();if(!['owner','admin'].includes(session.user.role)){location.href='index.html';throw Error('دسترسی مدیر لازم است.')}return session}
export async function mountAuthHeader(){const h=document.querySelector('.header-actions'),user=DB.getUser();if(!h)return;const a=h.querySelector('.auth-link');if(a){a.href=user?'account.html':'login.html';a.textContent=user?'حساب من':'ورود / ثبت‌نام'}}
document.addEventListener('DOMContentLoaded',mountAuthHeader);
