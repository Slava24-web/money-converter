import './App.css'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

function App() {
    const [currency, setCurrency] = useState([])
    const [current, setCurrent] = useState('')
    const [money, setMoney] = useState(0)
    const [result, setResult] = useState(0)

    // Запрос списка валют
    useEffect(() => {
        const getCurrency = async () => {
            const response = await fetch('http://51.250.115.125:8091/shubin/money/currency')
            if (response.ok) {
                return await response.json()
            }
        }

        getCurrency().then(data => {
            setCurrency(data)
            setCurrent(data[0].key)
        })
    }, [])

    // Расчёт
    useEffect(() => {
        if (current) {
            const calcMoney = async () => {
                const response = await fetch('http://51.250.115.125:8091/shubin/money/currency', {
                    method: 'POST',
                    body: JSON.stringify({ key: current, value: money }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                })
                if (response.ok) {
                    return await response.json()
                }
            }

            calcMoney().then(data => setResult(data?.value))
        }
    }, [money, current])

    console.log(money, current)

    return (
        <div className="container">
            <h1>Конвертер валют</h1>
            <p className="grey">Онлайн конвертация валют</p>
            <h3 className="lighter">Конвертер по курсу ЦБ на сегодня</h3>

            <Form className="calc">
                <Form.Group className="flex">
                    <Form.Control type="number" onChange={(e) => setMoney(parseFloat(e?.target?.value))} className="control" />
                    <Form.Select onChange={(e) => setCurrent(e?.target?.value)} className="select">
                        {
                            currency.map(({ key, name }) =>
                                <option value={key}>{key} ({name})</option>
                            )
                        }
                    </Form.Select>
                </Form.Group>

                <img src='https://zabavnikplus.ru/wp-content/uploads/3/3/4/334c8c9ad20539748c595ad90cd14f20.png' className='arrow'/>

                <Form.Group className="flex">
                    <Form.Control type="number" value={result} className="control" />
                    <Form.Select className="select">
                        <option value={"RUB"}>RUB (Российский рубль)</option>
                    </Form.Select>
                </Form.Group>
            </Form>
        </div>
    );
}

export default App
