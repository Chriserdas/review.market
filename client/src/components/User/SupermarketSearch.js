import axios from "axios";
import {React,useState,useEffect} from "react";



const SupermarketSearch = (props) => {

    let title = props.title;
    const [searchValue,setSearchValue] = useState("");
    const [showSearchResult,setShowSearchResult] = useState(false);
    const [searchResults,setSearchResults] = useState(null);
    const setSupermarkets = props.setSupermarkets;
    const setOffers = props.setOffers;

    const handleSearch = (event)=>{
        setSearchValue(event.target.value);
        if(event.target.value !== ""){
            setShowSearchResult(true);
            
            axios.post('http://localhost:5000/api/supermarket/search',{supermarketString: event.target.value})
            .then(response=>{
                if(response.data.length !==0)
                    setSearchResults(response.data[0].uniqueName);
                else setShowSearchResult(false);
            })
        }
        else {
            setShowSearchResult(false);
        }
    }

    useEffect(()=>{
        if(searchValue === ""){
            axios.get('http://localhost:5000/api/getSupermarket')
            .then((response) => {
                setSupermarkets(response.data);
                axios.get("http://localhost:5000/api/getCurrentLocation").then((res) => {
                    setOffers(res.data);
                });
            })
        }
    },[searchValue])

    const handleSearchClick = (super_name)=>{
        setSearchValue(super_name);
        setShowSearchResult(false);
        axios.post("http://localhost:5000/api/supermarket/getWithName",{super_name})
        .then(response=>{
            setSupermarkets(response.data.no_offers[0].supermarkets);
            if(response.data.offers.length === 0) setOffers(null);

            else setOffers(response.data.offers[0].supermarkets)
            
        });
    }
    
    let search =
        <>
            <div className="createOffer_txt">{title}</div>
            <div className="createOffer_search">
                <input
                    value={searchValue}
                    placeholder="Search for supermarkets..."
                    onChange={handleSearch}
                                        
                />
            </div>
            <div className="search_results" style={{display:showSearchResult===true ? 'flex' : 'none'}}>
                {showSearchResult === true && searchResults!==null ?
                    (
                        searchResults.map(supermarketName =>(
                            <div key={supermarketName} 
                                className="category"
                                onClick={()=>{
                                    handleSearchClick(supermarketName)
                                }}
                            > 
                                {supermarketName}
                            </div>
                        ))
                    )
                    :""
                }
            </div>
        </>
        

    return (
        <div className="search_container">
            {search}
        </div>
    )
}



export default SupermarketSearch;