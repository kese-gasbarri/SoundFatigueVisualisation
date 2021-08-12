
import React, { useState,useRef } from 'react'
/** Create a simple object*/
interface Person{
    firstName: string;
    lastName: string;
}
/** Props. ? means its optional */
interface Props{
    text: string;
    ok?: boolean;
    i?: number;
    fn?: (bob: string)=> string;
    person: Person;
}

interface TextNode{
    text:string;
}

export const TextField: React.FC<Props> = () =>{
     /** Hook 
      * This state were storing here can be a number or it can be null 
      * i.e  useState<number | null>(5)
     */
    const[count,setCount] = useState<TextNode>({text:'hello'});
    const inputRef = useRef<HTMLInputElement>(null);

    
    return(
        <div>
            <input ref={inputRef}/>
        </div>
    );
};