import {useState} from 'react';

export const useForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const onChange = e =>{
        setValues({...values, [e.target.name]: e.target.value})
    }

    const onSubmit = event => {
        event.preventDefault();
        callback();
    }

    return {
        onChange,
        onSubmit,
        values
    }
} ;

export const useTransferForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const onChangeInput = e =>{
        setValues({...values, [e.target.name]: e.target.value})
    }

    const onSelectionInputFrom = e =>{
        if (e.target.id !== "form-select-control-from"){
            setValues({...values, senderAccountId: e.target.children.length===1?e.target.children[0].innerText.split("(")[1].slice(0,-1):e.target.innerText.split("(")[1].slice(0,-1)});
        }
        
    }

    const onSelectionInputTo = e =>{
        setValues({...values, receiverAccountId: e.target.children.length===1?e.target.children[0].innerText.split("(")[1].slice(0,-1):e.target.innerText.split("(")[1].slice(0,-1)})
    }

    const onSubmit = event => {
        event.preventDefault();
        //console.log(values);
        callback();
    }

    return {
        onChangeInput,
        onSelectionInputFrom,
        onSelectionInputTo,
        onSubmit,
        values
    }
} ;

export const usePayForm = (callback, initialState = {}) => {
    const [values2, setValues2] = useState(initialState);

    const onChangeInput2 = e =>{
        setValues2({...values2, [e.target.name]: e.target.value})
    }

    const onSelectionInputFrom2 = e =>{
        if (e.target.id !== "form-select-control-pay-from"){
            setValues2({...values2, senderAccountId: e.target.children.length===1?e.target.children[0].innerText.split("(")[1].slice(0,-1):e.target.innerText.split("(")[1].slice(0,-1)});
        }
        
    }

    const onSubmit2 = event => {
        event.preventDefault();
        //console.log(values2);
        callback();
    }

    return {
        onChangeInput2,
        onSelectionInputFrom2,
        onSubmit2,
        values2
    }
} ;
