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
import sephiroth from "../../Assets/Sephiroth.gif"

function BossCards() {
    // ================================== MONSTER ARRAY ==================================
    const monsterArray = [
        {
            name: "Sephiroth",
            hp: 9999,
            attack: 9999,
            defense: 9999,
            gil: 9999,
            intro: "There is one SOLDIER named Sephiroth, who is a tall man with a muscular build. He wears a long black coat with silver pauldrons, black boots and black trousers. The top of his coat is open to reveal his chest, with his leather SOLDIER suspenders crossed over it. Sephiroth's long silver hair has bangs parted to either side of his face. When he found out about the terrible experiments that made him, he began to hate Shinra. Over time, he began to hate everything - including YOU!",
            image: sephiroth
        }
    ]

    // =============================== TEMP PLAYER STATS (TO BE DELETED LATER) ===================
    const tempPlayer =
    {
        name: "Temporary Player",
        hp: 150,
        attack: 45,
        defense: 22,
        gil: 250,
        potion: 5
    };

    const [tempPlayerStats, setTempPlayerStats] = useState(tempPlayer);

    // ============================== GAME LOGIC ===============================================
    const [monsterStats, setMonsterStats] = useState(
        monsterArray[Math.floor(Math.random() * Math.floor(1))]

    );

    const [win, setWin] = useState();

    const [lose, setLose] = useState();

    const [run, setRun] = useState();

    // ================================ USER/PLAYER LOGIC & INFO =====================================
    // --------------------- Will pull info from db -------------------------------------
    const [userStats, setUserStats] = useState();

    // useEffect(() => {
    //     const userId = localStorage.getItem("userId");
    //     API.getStat(userId).then(res => {
    //         setUserStats(res.data)
    //     });
    // }, []);

    // ==================================== COMBAT LOGIC =======================================
    const handleAttack = () => {
        console.log("attack")
        const monsterHitPoints = combatAPI.attack(tempPlayerStats.attack, monsterStats.hp, monsterStats.defense);
        if (monsterHitPoints <= 0) {
            setWin("You Win", setTimeout(function () {
                window.location = "/Victory"
            }, 2000));
            //add user gil after defeating monster
        } else {
            setMonsterStats({ ...monsterStats, hp: monsterHitPoints });
            const playerHitPoints = combatAPI.monsterRet(tempPlayerStats.hp, tempPlayerStats.defense, monsterStats.attack);
            if (playerHitPoints <= 0) {
                setLose("You Lose", setTimeout(function () {
                    window.location = "/Defeat"
                }, 2000));
            } else {
                setTempPlayerStats({ ...tempPlayerStats, hp: playerHitPoints })
            };
        };
    };

    const handleGuard = () => {
        console.log("guard")
        const playerHitPoints = combatAPI.guard(tempPlayerStats.hp, tempPlayerStats.defense, monsterStats.attack);
        if (playerHitPoints <= 0) {
            setLose("You Lose", setTimeout(function () {
                window.location = "/Defeat"
            }, 2000));
        } else {
            setTempPlayerStats({ ...tempPlayerStats, hp: playerHitPoints });
            const monsterHitPoints = combatAPI.attack(tempPlayerStats.attack, monsterStats.hp, monsterStats.defense);
            if (monsterHitPoints <= 0) {
                setWin("You Win", setTimeout(function () {
                    window.location = "/Victory"
                }, 2000));
                //add user gil after defeating monster
            } else {
                setMonsterStats({ ...monsterStats, hp: monsterHitPoints });
                // setMonsterStats({ ...monsterStats, hp: monsterHitPoints });
            };
        };
    };

    const handlePotion = () => {
        console.log("potion")
        const playerHitPoints = combatAPI.usePotion(tempPlayerStats.hp);
        if (tempPlayerStats.potion >= 1) {
            const playerPotions = combatAPI.reducePotions(tempPlayerStats.potion);
            setTempPlayerStats({ ...tempPlayerStats, hp: playerHitPoints, potion: playerPotions });
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
        <Container-fluid>
            <Jumbotron>
                <h2>Your adventure leads you to the Boss Fight!</h2>
            </Jumbotron>
            <Row>
                <Col xs={6} md={4}>
                    <CardGroup>
                        <Card style={{ width: '18rem' }} className="player">
                            <Card.Img variant="top" src={player} />
                            <Card.Body>
                                <Card.Title>{tempPlayerStats.name}</Card.Title>
                                <Card.Text>
                                    You draw your Great Sword of Leeching (small chance to heal yourself during combat)!
                                    <br />
                                    <br />
                                    Prepare to DIE!
                                </Card.Text>
                            </Card.Body>
                            <ListGroup horizontal className="stats">
                                <ListGroupItem><b>HP:</b> {tempPlayerStats.hp}</ListGroupItem>
                                <ListGroupItem><b>Attack:</b> {tempPlayerStats.attack}</ListGroupItem>
                                <ListGroupItem><b>Defense:</b> {tempPlayerStats.defense}</ListGroupItem>
                                <ListGroupItem><b>Potions:</b> {tempPlayerStats.potion}</ListGroupItem>
                                <ListGroupItem><b>Gil:</b> {tempPlayerStats.gil}</ListGroupItem>
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
                <Col xs={6} md={4}>
                    {win &&
                        <div className="victory">
                            {win}
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
                <Col xs={6} md={4}>
                    <CardGroup>
                        <Card style={{ width: '18rem' }} className="enemy">
                            <Card.Img variant="top" src={monsterStats.image} />
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


        </Container-fluid>
    );
}

export default BossCards;