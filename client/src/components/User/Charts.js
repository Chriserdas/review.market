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
    
    const [chartOptions, setChartOptions] = useState({})

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

            </div>
        </div>
    )
}


export default Charts;