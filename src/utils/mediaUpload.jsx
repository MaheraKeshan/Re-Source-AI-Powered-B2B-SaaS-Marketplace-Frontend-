import { createClient } from "@supabase/supabase-js";

const url ="https://bhyvhhbfubygegvvlyss.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXZoaGJmdWJ5Z2VndnZseXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTM5NjcsImV4cCI6MjA4MzE4OTk2N30.GgxqFW_zGHoCp9Anquf1XMaF51f7S955isxd3E39NJs"

const supabase = createClient(url, key)	

export default function mediaUpload(file){

	return new Promise((resolve, reject) => {

		if(file==null) {
			reject("No file selected");
			return;
		}	

		const timestamp = new Date().getTime();
		const newName = timestamp + file.name;
		
		supabase.storage.from("IslandLink").upload(newName, file,{
			upsert:false,
			cacheControl:"3600",	
		}).then(() => {
			const publicUrl = supabase.storage.from("IslandLink").getPublicUrl(newName).data.publicUrl
			resolve(publicUrl)

		}).catch(() => {
			reject("Error occured in supabase connection")
		})	
	})
}
	

