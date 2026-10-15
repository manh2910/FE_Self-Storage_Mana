const {readFileSync}=require('node:fs')
const path=require('node:path')
const Module=require('node:module')
const ts=require('typescript')
const {test}=require('node:test')
const assert=require('node:assert/strict')
const filename=path.resolve(__dirname,'../src/features/auth/model/authSession.ts')
const loaded=new Module(filename,module)
loaded._compile(ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename)
const {readAuthState,persistAuth,clearAuth}=loaded.exports
const user={userId:5,fullName:'Alex Nguyen',email:'alex@example.com',role:'StorageCustomer',status:'Active'}
function setup(){const values=new Map();return {values,storage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}}}
test('Guest access does not create an authentication session',()=>{
  const {values,storage}=setup()
  assert.equal(readAuthState(storage).isAuthenticated,false)
  assert.equal(values.size,0)
})
test('Login survives reload; logout clears only authentication and preserves guest bookings',()=>{
  const {values,storage}=setup()
  values.set('selfstorage:demo-bookings:v1:0','guest-bookings')
  persistAuth(storage,'session-token',user)
  assert.deepEqual(readAuthState(storage).user,user)
  assert.equal(readAuthState(storage).isAuthenticated,true)
  clearAuth(storage)
  assert.equal(readAuthState(storage).isAuthenticated,false)
  assert.equal(values.get('selfstorage:demo-bookings:v1:0'),'guest-bookings')
})
test('Corrupt, incomplete and unreadable storage show signed-out state',()=>{
  const {values,storage}=setup()
  values.set('token','session-token')
  for(const value of ['broken','null','{}',JSON.stringify({...user,role:'unknown'})]){
    values.set('user',value)
    assert.equal(readAuthState(storage).isAuthenticated,false)
  }
  assert.equal(readAuthState({getItem(){throw Error('blocked')}}).isAuthenticated,false)
})
test('Failed persistence does not leave a partially authenticated session',()=>{
  const {values,storage}=setup()
  assert.throws(()=>persistAuth({...storage,setItem(key,value){if(key==='token')throw Error('full');storage.setItem(key,value)}},'session-token',user))
  assert.equal(values.has('token'),false)
  assert.equal(values.has('user'),false)
})
