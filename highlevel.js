import { fetchTimeout } from './security.js';
const BASE='https://services.leadconnectorhq.com';
export const ENDPOINTS={
  contactUpsert:{method:'POST',path:'/contacts/upsert',version:'v3',scope:'contacts.write'},
  addTags:{method:'POST',path:'/contacts/:contactId/tags',version:'v3',scope:'contacts.write'}
};
function headers(env,version){return {authorization:`Bearer ${env.GHL_PRIVATE_TOKEN}`,version,'content-type':'application/json'}}
async function call(env, spec, path, body){
  let r; try{r=await fetchTimeout(`${BASE}${path}`,{method:spec.method,headers:headers(env,spec.version),body:JSON.stringify(body)},8000)}catch(e){if(e?.name==='AbortError')throw Object.assign(new Error('UPSTREAM_TIMEOUT'),{kind:'timeout'});throw Object.assign(new Error('UPSTREAM_NETWORK'),{kind:'network'});}
  if(!r.ok){const retryAfter=r.headers.get('retry-after');throw Object.assign(new Error('UPSTREAM_HTTP'),{kind:'http',status:r.status,retryAfter});}
  try{return await r.json()}catch{throw Object.assign(new Error('UPSTREAM_INVALID_JSON'),{kind:'invalid_json'});}
}
export function buildUpsertPayload(lead,env){return {locationId:env.GHL_LOCATION_ID,name:lead.name,phone:lead.phone,email:lead.email||undefined,city:lead.city,source:`UROCLINIC web ${lead.source||''}`.trim().slice(0,100),createNewIfDuplicateAllowed:false};}
export async function upsertContact(lead,env){const data=await call(env,ENDPOINTS.contactUpsert,ENDPOINTS.contactUpsert.path,buildUpsertPayload(lead,env));const id=data?.contact?.id;if(!id)throw Object.assign(new Error('UPSTREAM_SCHEMA'),{kind:'schema'});return {contactId:id,isNew:Boolean(data.new)};}
export async function addTags(contactId,tags,env){const path=ENDPOINTS.addTags.path.replace(':contactId',encodeURIComponent(contactId));await call(env,ENDPOINTS.addTags,path,{tags});}
