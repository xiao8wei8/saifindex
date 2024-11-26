import { isDev } from '@/utils/index';
const host = isDev?"http://localhost:3000/":"https://www.saifchat.com/"; 
const maps = {
    "url":host+"/api/sql"
}
export default maps