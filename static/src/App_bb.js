import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios/index";
import registerServiceWorker from "./registerServiceWorker";
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import ReactDOM from 'react-dom';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;
const wrapperStyle = { width: 400, margin: 50 };




const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};


export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            "start_t": "1960",
            "end_t": "2018",
            "max_num":200,
            "genres":"All"
        }
    }
    sendData () {
        console.log(this.state);
        axios.post('http://127.0.0.1:5000/messages', this.state,{
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    modifyTime(e) {
        console.log(e)
        //this.setState({"start_t": e[0]});
        //this.setState({"end_t": e[1]});
        this.sendData();
    }

    modifyMaxNum(e) {
        this.setState({"max_num": e.target.value});
        this.sendData();
    }
    modifyGenres(e) {
        this.setState({"genres": e.target.value});
        this.sendData();
    }



    render(){
        return(	<div>
            <div style={wrapperStyle}>
                <p>Range with custom handle</p>
                <Range min={0} max={20} defaultValue={[3, 10]} tipFormatter={value => `${value}%`} onChange = {e => this.modifyTime(e)}/>
            </div>
        </div>);
    };
};

