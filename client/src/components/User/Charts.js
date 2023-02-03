import axios from "axios";
import {React,useEffect,useState} from "react";
import { Bar } from 'react-chartjs-2';
import{
    Chart as ChartJs,
    LinearScale,
    BarElement,
    CategoryScale,
    Title,
    Legend,
    Tooltip
} from "chart.js"

ChartJs.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Legend,
);

const Charts = ()=>{
    
    const [chartData,setChartData] = useState({
        datasets:null
    });

    const [category,setCategory] = useState({
        show:false,
        name:"Choose Category",
        id:"",
    });

    const [avgChartData,setAvgChartData] = useState({
        datasets:null
    });

    const [chart2Options, setChart2Options] = useState({})
    
    const [categories,setCategories] = useState(null);

    const [subCategory,setSubCategory] = useState({
        show:false,
        name:"Choose Subcategory",
        id:"",
    });

    const [subCategories,setSubCategories] = useState(null);

    const [chartOptions, setChartOptions] = useState({})
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const [pickMonth,setPickMonth] = useState({
        show:false,
        month:months[new Date().getMonth()],
    });

    const [pickYear,setPickYear] = useState({
        show:false,
        year:new Date().getFullYear(),
    });

    let years = [];
    const currentYear = new Date().getFullYear();
        

    for (let i = currentYear; i >= 2022; i--) {
        years.push(i);
    }

    useEffect(()=>{
        axios.post("http://localhost:5000/api/chart1",{month:months.indexOf(pickMonth.month),year:pickYear.year})
        .then(response => {
            let daysInMonth = new Date(pickYear.year, months.indexOf(pickMonth.month) + 1, 0).getDate();
            let days = [];
            let data = [];
    
            for (let i = 1; i <= daysInMonth; i++) {
                days.push(i);
            }

            if(response.data.length !==0){
                data = days.map(day=>{

                    let obj = response.data.find(d=>new Date(d._id).getDate() === day)
                    return obj ? obj.offerCount : 0;
                })
                
            }
            else{
                days.map(day=>data.push(0))
            }
            
            setChartData({
                labels: days,
                datasets: [
                    {
                        label:"offers",
                        data: data,
                        borderColor:'transparent',
                        backgroundColor:'#229673',
                        color:'white',
                        marginRight:'5px',
                        width:'5px'
                    }
                ]
            });

            setChartOptions({
                responsive:true,
                maintainAspectRatio:false,
                height:'300px',
                width:'150px',
                plugins:{
                    colors: {
                        enabled: false
                    },
                    legend:{
                        position:"top"
                    },
                    title:{
                        display:true,
                        text:"Offers created on " + pickMonth.month + " " + pickYear.year,
                    }
                },
                scales: {
                    x: {
                        ticks:{
                            color:'white',
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        barThickness: 20,
                        ticks:{
                            color:'#229673',
                            beginAtZero: true,
                            callback: function(value) {if (value % 1 === 0) {return value;}}
                        },
                        grid: {
                            display: false
                        }
                    }
                  }
            })
        })
    },[pickMonth.month,pickYear.year]);

    useEffect(()=>{
        if(category.show){
            axios.get('http://localhost:5000/categories')
            .then(response => {
                setCategories(response.data);
            })
        }
    },[category]);
    

    useEffect(()=>{
        let sendSubcategory = false;

        if(subCategory.name !== 'Choose Subcategory'){
            sendSubcategory = true;
        }

        if(category.name !== 'Choose Category'){
            axios.post('http://localhost:5000/chart2',{date:date,categoryId:category.id,subCategoryId:sendSubcategory===true ? subCategory.id : ''})
        .then(response => {
            const sortedData = response.data.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });

            setAvgChartData({
                labels: sortedData.map(d=>new Date(d.date).getDate()),
                datasets: [
                    {
                        label:"Average Discount",
                        data: sortedData.map(d=> d.result),
                        borderColor:'transparent',
                        backgroundColor:'rgb(255, 81, 81)',
                        color:'white',
                        marginRight:'5px',
                        width:'5px',
                    }
                ]
            });

            setChart2Options({
                responsive:true,
                maintainAspectRatio:false,
                height:'350px',
                width:'200px',
                barPercentage: 0.2,
                
                plugins:{
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    colors: {
                        enabled: false
                    },
                    legend:{
                        position:"top"
                    },
                    title:{
                        display:true,
                        text:"Average price of products in a week",
                    }
                },
                scales: {
                    x: {
                        ticks:{
                            color:'white',
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        ticks:{
                            color:'rgb(255, 81, 81)',
                            beginAtZero: true,
                        },
                        grid: {
                            display: false
                        }
                    }
                  }
            })
        });
        }

    },[date, category.name,subCategory.name]);

 
    return (
        <div className="charts_container">
            <div className="chart1">
                <div className="DatePicker">
                    <div className="monthPick">
                        <div 
                            className="chosenMonth" 
                            onClick={()=>{
                                setPickMonth({show:!pickMonth.show,month:pickMonth.month})
                                setPickYear({show:false,year:pickYear.year})
                            }}
                        >{pickMonth.month}</div>
                        <div style={{display:pickMonth.show === true ?'flex' : 'none'}} className="months">
                            { 
                                months.map((month,index) =>(
                                    <div 
                                        key={index} 
                                        className="month"
                                        onClick={()=>{setPickMonth({show:false,month:month})}}
                                    >{month}</div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="yearPick">
                        <div className="chosenMonth" 
                            onClick={()=>{
                                setPickYear({show:!pickYear.show,year:pickYear.year})
                                setPickMonth({show:false,month:pickMonth.month})
                            }}
                        >{pickYear.year}</div>
                        <div style={{display:pickYear.show === true ?'flex' : 'none'}} className="years">
                            {years.length!==0 ? 
                                years.map((year,index) => (
                                    <div 
                                        key={index} 
                                        className="year"
                                        onClick={()=>{
                                            setPickYear({show:false, year:year})
                                        }}
                                    >{year}</div>
                                ))
                                :""
                            }
                        </div>    
                    </div>
                </div>
                <div className="chart1_container">
                    {chartData.datasets!==null && chartOptions!=={} ? 
                        <Bar
                            style={{width:'80%'}}
                            data = {chartData}
                            options={chartOptions}
                        />:""
                    }
                </div>
            </div>
            <div className="chart2">
                    <div className="date_container">
                        <input 
                            type='date'
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                        />
                        <div className="chooseCategory">
                            <div className="choose_category_title" onClick={()=>{setCategory({show: !category.show,name: category.name,id: category.id})}}>{category.name}</div>
                            <div className="categories" style={{display:category.show ? 'flex' : 'none',flexDirection: 'column'}}>
                                {categories !== null ? 
                                    (
                                        categories.map(result => (
                                            <div 
                                                key={result._id} 
                                                className="category" 
                                                onClick={()=>{
                                                    setCategory({show:false,name: result.name,id: result.id});
                                                    setSubCategory({show:false, name:'Choose Subcategory', id:''});
                                                    setSubCategories(result.subcategories);
                                                }}

                                            >{result.name}</div>
                                        ))
                                    )
                                    : ""
                                }
                            </div>
                        </div>
                        <div className="chooseSubCategory">
                            <div className="choose_category_title" onClick={()=>{setSubCategory({show: !subCategory.show,name: subCategory.name,id: subCategory.id})}}>{subCategory.name}</div>
                            <div className="categories" style={{display:subCategory.show ? 'flex' : 'none',flexDirection: 'column'}}>
                                {subCategories !== null ? 
                                    (
                                        subCategories.map(result => (
                                            <div 
                                                key={result._id} 
                                                className="category" 
                                                onClick={()=>{
                                                    setSubCategory({show:false,name:result.name,id:result.uuid});
                                                }}

                                            >{result.name}</div>
                                        ))
                                    )
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                    <div className="chart1_container" style={{top:'170px'}}>
                        
                        {avgChartData.datasets!==null && chart2Options!=={} ?
                            (
                                <>
                                    <div>
                                        <p
                                            onClick={()=>{
                                                setDate(new Date(new Date(date).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10));
                                            }}
                                        >&lt;</p>
                                        <h1>{date}</h1>
                                        <p
                                            onClick={()=>{
                                                setDate(new Date(new Date(date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10));
                                            }}
                                        >&gt;</p>
                                    </div>
                                    <Bar 
                                        style ={{width:'90%',position:'relative',left:'5%'}}
                                        data = {avgChartData}
                                        options={chart2Options}
                                    />
                                </>
                            ):""
                        }
                    </div>
            </div>
        </div>
    )
}


export default Charts;