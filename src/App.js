import logo from './logo.svg';
import './App.css';
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import useAxios from "./hooks/useAxios.js";
import packageJson from '../package.json';
import { useEffect } from 'react';
import { getLatestBuildVersion } from './pages/overTheUpdate.services';
import { VERSION_CONTROL } from '../../optivalhrms-web/src/config/environment.config';


function App() {

  const [
    latestBuildVersionResponse,
    latestBuildVersionError,
    latestBuildVersionLoading,
    fetchlatestBuildVersion,
  ] = useAxios();

  function compareVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    
    const minLength = Math.min(v1.length, v2.length);
    
    for (let i = 0; i < minLength; i++) {
        if (v1[i] < v2[i]) {
            return -1; // version1 is older
        } else if (v1[i] > v2[i]) {
            return 1; // version1 is newer
        }
    }
    
    // If all common components are equal, the longer version is considered newer
    if (v1.length < v2.length) {
        return -1;
    } else if (v1.length > v2.length) {
        return 1;
    }
    
    return 0; // versions are equal
}
const currentVersion = VERSION_CONTROL;
const aws_url = "https://mphrms-test-public.s3.amazonaws.com/"
useEffect(async() => {
  try{


  console.log("htllo")
  console.log(latestBuildVersionResponse?.build_version)
  console.log(currentVersion)
  if(latestBuildVersionResponse?.build_version){
    if(currentVersion != latestBuildVersionResponse?.build_version){
      if(compareVersions(currentVersion,latestBuildVersionResponse?.build_version) == -1){

        const data = await CapacitorUpdater.download({
          url: aws_url+latestBuildVersionResponse?.url_path ,
          version: latestBuildVersionResponse?.build_version,
        })
        
        await CapacitorUpdater.set({ id: data.id })
      }
    }
  }
  else{
    console.log("bye")
  }
}
catch (error) {
  console.log(error)
}
},[latestBuildVersionResponse])

useEffect(() => {
  fetchlatestBuildVersion(getLatestBuildVersion())
},[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit cdc sdfsdfwsdfsd fsd fsdfsdsd f sddssda  <code>src/App.js</code> 
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
