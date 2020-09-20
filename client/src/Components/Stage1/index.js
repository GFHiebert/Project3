import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroupItem from "react-bootstrap/ListGroupItem"
import combatAPI from "../../Utils/combatAPI"
import API from "../../Utils/API"
import "./style.css";
import player from "../../Assets/knight.gif"
import orc from "../../Assets/orc.gif"
import slime from "../../Assets/slime.gif"
import chocobo from "../../Assets/chocobo.gif"
import yevzilla from "../../Assets/yevzilla.gif"
import bialalama from "../../Assets/biala-lama.gif"
import himadrigotica from "../../Assets/himadrigotica.gif"
import garretpooficus from "../../Assets/garretpooficus.gif"
import kaiwhywhywhy from "../../Assets/kaiwhywhywhy.gif"


function Stage1Cards() {

    // ================================== MONSTER ARRAY ==================================
    const monsterArray = [
        {
            name: "Orc",
            hp: 100,
            attack: 60,
            defense: 20,
            gil: 45,
            intro: "The savage Orc of Mount Kararak was separated from his horde.  His eyes began to glare as he sees you.  He is ready to crush you!",
            image: orc
        },
        {
            name: "Slime",
            hp: 75,
            attack: 45,
            defense: 15,
            gil: 45,
            intro: "Acidic slime that can melt the toughest armors if absorbed, starts jiggling towards you!",
            image: slime
        },
        {
            name: "Chocobooboo",
            hp: 150,
            attack: 50,
            defense: 20,
            gil: 45,
            intro: "This ain't your regular Honey Boo Boo...this is Chocobooboo! Chocobooboo glares at you with anger after noticing that you stepped on its food!",
            image: chocobo
        },
        {
            name: "Yevzilla",
            hp: 500,
            attack: 45,
            defense: 5,
            gil: 200,
            intro: "Yevzilla rises out of the ocean! Someone woke him from his slumber! If not defeated quickly, his lazer breath will destroy ALL!",
            image: yevzilla
        },
        {
            name: "Biala-lama",
            hp: 125,
            attack: 55,
            defense: 35,
            gil: 200,
            intro: "Biala-lama nears! Watch out for the elbows and knees of this creature - they are muaitastic!",
            image: bialalama
        },
        {
            name: "Himadrigotica",
            hp: 150,
            attack: 45,
            defense: 20,
            gil: 45,
            intro: "Himadrigotica is a unique species of a goat that can only be found in the Dark Forest and on Mount Kararak.  It has a nasty kick and an even nastier meeehhh-nsult!",
            image: himadrigotica
        },
        {
            name: "Garretpooficus",
            hp: 100,
            attack: 45,
            defense: 25,
            gil: 200,
            intro: "Not much is know about this creature except that it waits for its victims and then throws insults at them",
            image: garretpooficus
        },
        {
            name: "Kaiwhywhywhy",
            hp: 90,
            attack: 45,
            defense: 30,
            gil: 200,
            intro: "This creature will defeat you with its WHY WHY WHY attack!",
            image: kaiwhywhywhy
        }
    ]

    // ============================== GAME LOGIC ===============================================
    const [monsterStats, setMonsterStats] = useState(
        monsterArray[Math.floor(Math.random() * Math.floor(8))]

    );

    const [win, setWin] = useState();

    const [lose, setLose] = useState();

    const [run, setRun] = useState();

    // ================================ USER/PLAYER LOGIC & INFO =====================================
    // --------------------- Will pull info from db -------------------------------------
    const [userStats, setUserStats] = useState({
        name: localStorage.getItem("firstName"), hp: "", attack: "", defense: "", potion: "", gil: ""
    });

    console.log(userStats)
    useEffect(() => {
        const userId = localStorage.getItem("id");
        
        API.getStat(userId).then(res => {
            console.log("get stat on stage1")
            console.log(res.data)
            setUserStats(res.data)
            console.log(res)
        });
    }, []);

    // ==================================== COMBAT LOGIC =======================================
    const handleAttack = () => {
        console.log("attack")
        const monsterHitPoints = combatAPI.attack(userStats.attack, monsterStats.hp, monsterStats.defense);
        if (monsterHitPoints <= 0) {
            const newGil = userStats.gil + monsterStats.gil
            const gilUpdate = { gil: newGil };
            API.saveStat(gilUpdate)
            setUserStats({ ...userStats, gil: newGil })
            setWin("You Win");
        } else {
            setMonsterStats({ ...monsterStats, hp: monsterHitPoints });
            const playerHitPoints = combatAPI.monsterRet(userStats.hp, userStats.defense, monsterStats.attack);
            if (playerHitPoints <= 0) {
                setLose("You Lose", setTimeout(function () {
                    window.location = "/Defeat"
                }, 2000));
            } else {
                setUserStats({ ...userStats, hp: playerHitPoints })
            };
        };
    };

    const handleGuard = () => {
        console.log("guard")
        const playerHitPoints = combatAPI.guard(userStats.hp, userStats.defense, monsterStats.attack);
        if (playerHitPoints <= 0) {
            setLose("You Lose", setTimeout(function () {
                window.location = "/Defeat"
            }, 2000));
        } else {
            setUserStats({ ...userStats, hp: playerHitPoints });
            const monsterHitPoints = combatAPI.attack(userStats.attack, monsterStats.hp, monsterStats.defense);
            if (monsterHitPoints <= 0) {
                const newGil = userStats.gil + monsterStats.gil
                const gilUpdate = { gil: newGil };
                API.saveStat(gilUpdate)
                setUserStats({ ...userStats, gil: newGil })
                setWin("You Win");
            } else {
                setMonsterStats({ ...monsterStats, hp: monsterHitPoints });
                // setMonsterStats({ ...monsterStats, hp: monsterHitPoints });
            };
        };
    };

    const handlePotion = () => {
        console.log("potion")
        const playerHitPoints = combatAPI.usePotion(userStats.hp);
        if (userStats.potion >= 1) {
            const playerPotions = combatAPI.reducePotions(userStats.potion);
            setUserStats({ ...userStats, hp: playerHitPoints, potion: playerPotions });
        } else {
            //need to block out the potions button - look at store code
        }
    };

    const handleRun = () => {
        setRun("RUN AWAY!!", setTimeout(function () {
            window.location = "/Defeat"
        }, 2000));
    };

    // ============================= REACT CARDS AND PAGE =====================================
    return (
        <div className="container-fluid">
            <Jumbotron>
                <h2>Your adventure leads you to Stage One!</h2>
            </Jumbotron>
            <Row>
                <Col sm={4} md={3}>
                    <CardGroup>
                        <Card style={{ width: '18rem' }} className="player">
                            <Card.Img class="sprite_card" variant="top" src={player} />
                            <Card.Body>
                                <Card.Title><b>{userStats && userStats.name}</b></Card.Title>
                                <Card.Text>
                                    You draw your Great Sword of Leeching (small chance to heal yourself during combat)!
                                    <br />
                                    <br />
                                    Prepare to fight the monster in front of you!
                                </Card.Text>
                            </Card.Body>
                            <ListGroup horizontal className="stats">
                                <ListGroupItem><b>HP:</b> {userStats && userStats.hp}</ListGroupItem>
                                <ListGroupItem><b>Attack:</b> {userStats && userStats.attack}</ListGroupItem>
                                <ListGroupItem><b>Defense:</b> {userStats && userStats.defense}</ListGroupItem>
                                <ListGroupItem><b>Potions:</b> {userStats.potion}</ListGroupItem>
                                <ListGroupItem><b>Gil:</b> {userStats.gil}</ListGroupItem>
                            </ListGroup>
                            <ListGroup className="list-group-flush" position="center">
                                <ListGroupItem><Button variant="danger" size="lg" onClick={handleAttack}>Attack</Button>
                                    <Button variant="warning" size="lg" onClick={handleGuard}>Guard</Button>
                                    <Button variant="success" size="lg" onClick={handlePotion}>Potion</Button>
                                    <Button variant="info" size="lg" onClick={handleRun} >Run!</Button></ListGroupItem>
                            </ListGroup>
                            {/* <Card.Body>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body> */}
                        </Card>
                    </CardGroup>
                </Col>
                <Col xs={3} sm={4} md={6}>
                    {win &&
                        <div className="victory">
                            {win}
                            <div>
                                <Button className="nextStage" variant="primary" size="lg" href={"/" + "Boss"}>Charge Forth!</Button> <Button className="toStore" variant="primary" size="lg" href={"/" + "Store"}>To the Shop...</Button>
                            </div>
                        </div>}
                    {lose &&
                        <div className="loser">
                            {lose}
                        </div>}
                    {run &&
                        <div className="runner">
                            {run}
                        </div>}
                </Col>
                <Col sm={4} md={3}>
                    <CardGroup>
                        <Card style={{ width: '18rem' }} className="enemy">
                            <Card.Img class="sprite_card" variant="top" src={monsterStats.image} />
                            <Card.Body>
                                <Card.Title>{monsterStats.name}</Card.Title>
                                <Card.Text>
                                    {monsterStats.intro}
                                </Card.Text>
                            </Card.Body>
                            <ListGroup horizontal className="stats">
                                <ListGroupItem><b>HP:</b> {monsterStats && monsterStats.hp}</ListGroupItem>
                                <ListGroupItem><b>Attack:</b> {monsterStats && monsterStats.attack}</ListGroupItem>
                                <ListGroupItem><b>Defense:</b> {monsterStats && monsterStats.defense}</ListGroupItem>
                            </ListGroup>
                            {/* <Card.Body>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body> */}
                        </Card>
                    </CardGroup>
                </Col>
            </Row>


        </div>
    );
}

export default Stage1Cards;