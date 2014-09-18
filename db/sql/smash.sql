--
-- PostgreSQL database dump
--

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: u_characters; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE u_characters (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    img character varying(20)
);


ALTER TABLE public.u_characters OWNER TO postgres;

--
-- Name: characters; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW characters AS
 SELECT u_characters.id,
    u_characters.name,
    u_characters.img
   FROM u_characters;


ALTER TABLE public.characters OWNER TO postgres;

--
-- Name: u_players; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE u_players (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.u_players OWNER TO postgres;

--
-- Name: players; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW players AS
 SELECT u_players.id,
    u_players.name
   FROM u_players;


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: u_stages; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE u_stages (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    img character varying(35)
);


ALTER TABLE public.u_stages OWNER TO postgres;

--
-- Name: stages; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW stages AS
 SELECT u_stages.id,
    u_stages.name,
    u_stages.img
   FROM u_stages;


ALTER TABLE public.stages OWNER TO postgres;

--
-- Name: u_fights; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE u_fights (
    id integer NOT NULL,
    date date DEFAULT now(),
    player1 integer,
    player2 integer,
    player3 integer,
    player4 integer,
    character1 integer,
    character2 integer,
    character3 integer,
    character4 integer,
    stage integer NOT NULL,
    winner integer NOT NULL,
    notes character varying(255)
);


ALTER TABLE public.u_fights OWNER TO postgres;

--
-- Name: fights; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW fights AS
 SELECT x.id,
    x.date,
    x.player1,
    x.p1name,
    x.player2,
    x.p2name,
    x.player3,
    x.p3name,
    x.player4,
    x.p4name,
    x.character1,
    x.c1name,
    x.character2,
    x.c2name,
    x.character3,
    x.c3name,
    x.character4,
    x.c4name,
    x.stage,
    x.stagename,
    x.winner,
    p.name AS winnername,
    x.winnerchar,
    c.name AS winnercharname,
    x.notes
   FROM ((( SELECT DISTINCT f.id,
            f.date,
            f.player1,
            p1.name AS p1name,
            f.player2,
            p2.name AS p2name,
            f.player3,
            p3.name AS p3name,
            f.player4,
            p4.name AS p4name,
            f.character1,
            c1.name AS c1name,
            f.character2,
            c2.name AS c2name,
            f.character3,
            c3.name AS c3name,
            f.character4,
            c4.name AS c4name,
            f.stage,
            s.name AS stagename,
            f.winner,
            f.notes,
                CASE
                    WHEN (f.winner = f.player1) THEN f.character1
                    WHEN (f.winner = f.player2) THEN f.character2
                    WHEN (f.winner = f.player3) THEN f.character3
                    WHEN (f.winner = f.player4) THEN f.character4
                    ELSE NULL::integer
                END AS winnerchar
           FROM (((((((((u_fights f
             LEFT JOIN players p1 ON ((p1.id = f.player1)))
             LEFT JOIN players p2 ON ((p2.id = f.player2)))
             LEFT JOIN players p3 ON ((p3.id = f.player3)))
             LEFT JOIN players p4 ON ((p4.id = f.player4)))
             LEFT JOIN characters c1 ON ((c1.id = f.character1)))
             LEFT JOIN characters c2 ON ((c2.id = f.character2)))
             LEFT JOIN characters c3 ON ((c3.id = f.character3)))
             LEFT JOIN characters c4 ON ((c4.id = f.character4)))
             LEFT JOIN stages s ON ((s.id = f.stage)))) x
     LEFT JOIN players p ON ((p.id = x.winner)))
     LEFT JOIN characters c ON ((c.id = x.winnerchar)));


ALTER TABLE public.fights OWNER TO postgres;

--
-- Name: findcfights(character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION findcfights(character varying DEFAULT NULL::character varying, character varying DEFAULT NULL::character varying, character varying DEFAULT NULL::character varying, character varying DEFAULT NULL::character varying) RETURNS SETOF fights
    LANGUAGE sql
    AS $_$ 
SELECT * FROM fights WHERE
($1 IS NULL OR $1 IN (lower(c1name), lower(c2name), lower(c3name), lower(c4name))) AND
($2 IS NULL OR $2 IN (lower(c1name), lower(c2name), lower(c3name), lower(c4name))) AND
($3 IS NULL OR $3 IN (lower(c1name), lower(c2name), lower(c3name), lower(c4name))) AND
($4 IS NULL OR $4 IN (lower(c1name), lower(c2name), lower(c3name), lower(c4name)))
$_$;


ALTER FUNCTION public.findcfights(character varying, character varying, character varying, character varying) OWNER TO postgres;

--
-- Name: findcfights(integer, integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION findcfights(integer DEFAULT NULL::integer, integer DEFAULT NULL::integer, integer DEFAULT NULL::integer, integer DEFAULT NULL::integer) RETURNS SETOF fights
    LANGUAGE sql
    AS $_$ 
SELECT * FROM fights WHERE
($1 IS NULL OR $1 IN (character1, character2, character3, character4)) AND
($2 IS NULL OR $2 IN (character1, character2, character3, character4)) AND
($3 IS NULL OR $3 IN (character1, character2, character3, character4)) AND
($4 IS NULL OR $4 IN (character1, character2, character3, character4))
$_$;


ALTER FUNCTION public.findcfights(integer, integer, integer, integer) OWNER TO postgres;

--
-- Name: findfights(character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION findfights(p character varying, c character varying) RETURNS SETOF fights
    LANGUAGE sql
    AS $$ 
SELECT * FROM fights WHERE 
(lower(p1name)=$1 AND lower(c1name)=$2) OR
(lower(p2name)=$1 AND lower(c2name)=$2) OR
(lower(p3name)=$1 AND lower(c3name)=$2) OR
(lower(p4name)=$1 AND lower(c4name)=$2) 
$$;


ALTER FUNCTION public.findfights(p character varying, c character varying) OWNER TO postgres;

--
-- Name: findfights(character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION findfights(p character varying, c integer) RETURNS SETOF fights
    LANGUAGE sql
    AS $$ 
SELECT * FROM fights WHERE 
(lower(p1name)=$1 AND character1=$2) OR
(lower(p2name)=$1 AND character2=$2) OR
(lower(p3name)=$1 AND character3=$2) OR
(lower(p4name)=$1 AND character4=$2) 
$$;


ALTER FUNCTION public.findfights(p character varying, c integer) OWNER TO postgres;

--
-- Name: findfights(integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION findfights(p integer, c character varying) RETURNS SETOF fights
    LANGUAGE sql
    AS $$ 
SELECT * FROM fights WHERE 
(player1=$1 AND lower(c1name)=$2) OR
(player2=$1 AND lower(c2name)=$2) OR
(player3=$1 AND lower(c3name)=$2) OR
(player4=$1 AND lower(c4name)=$2) 
$$;


ALTER FUNCTION public.findfights(p integer, c character varying) OWNER TO postgres;

--
-- Name: findfights(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION findfights(p integer, c integer) RETURNS SETOF fights
    LANGUAGE sql
    AS $$ 
SELECT * FROM fights WHERE 
(player1=$1 AND character1=$2) OR
(player2=$1 AND character2=$2) OR
(player3=$1 AND character3=$2) OR
(player4=$1 AND character4=$2) 
$$;


ALTER FUNCTION public.findfights(p integer, c integer) OWNER TO postgres;

--
-- Name: findpfights(character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION findpfights(character varying DEFAULT NULL::character varying, character varying DEFAULT NULL::character varying, character varying DEFAULT NULL::character varying, character varying DEFAULT NULL::character varying) RETURNS SETOF fights
    LANGUAGE sql
    AS $_$ 
SELECT * FROM fights WHERE
($1 IS NULL OR $1 IN (lower(p1name), lower(p2name), lower(p3name), lower(p4name))) AND
($2 IS NULL OR $2 IN (lower(p1name), lower(p2name), lower(p3name), lower(p4name))) AND
($3 IS NULL OR $3 IN (lower(p1name), lower(p2name), lower(p3name), lower(p4name))) AND
($4 IS NULL OR $4 IN (lower(p1name), lower(p2name), lower(p3name), lower(p4name)))
$_$;


ALTER FUNCTION public.findpfights(character varying, character varying, character varying, character varying) OWNER TO postgres;

--
-- Name: findpfights(integer, integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION findpfights(integer DEFAULT NULL::integer, integer DEFAULT NULL::integer, integer DEFAULT NULL::integer, integer DEFAULT NULL::integer) RETURNS SETOF fights
    LANGUAGE sql
    AS $_$ 
SELECT * FROM fights WHERE
($1 IS NULL OR $1 IN (player1, player2, player3, player4)) AND
($2 IS NULL OR $2 IN (player1, player2, player3, player4)) AND
($3 IS NULL OR $3 IN (player1, player2, player3, player4)) AND
($4 IS NULL OR $4 IN (player1, player2, player3, player4))
$_$;


ALTER FUNCTION public.findpfights(integer, integer, integer, integer) OWNER TO postgres;

--
-- Name: charactermeta; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW charactermeta AS
 SELECT x.id,
    x.name,
    x.total,
    x.wins,
        CASE
            WHEN (x.total = 0) THEN NULL::double precision
            ELSE ((x.wins)::double precision / (x.total)::double precision)
        END AS winpct
   FROM ( SELECT c.id,
            c.name,
            ( SELECT count(*) AS count
                   FROM findcfights(c.id) findcfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)) AS total,
            ( SELECT count(*) AS count
                   FROM findcfights(c.id) findcfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)
                  WHERE (findcfights.winnerchar = c.id)) AS wins
           FROM characters c) x;


ALTER TABLE public.charactermeta OWNER TO postgres;

--
-- Name: charactertimeline; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW charactertimeline AS
 SELECT r.date,
    r."character",
    r.wins,
    r.total,
        CASE
            WHEN (r.total = 0) THEN NULL::double precision
            ELSE ((r.wins)::double precision / (r.total)::double precision)
        END AS winpct
   FROM ( SELECT DISTINCT f.date,
            c.id,
            c.name AS "character",
            ( SELECT count(*) AS count
                   FROM fights
                  WHERE ((c.id = fights.winnerchar) AND (fights.date <= f.date))) AS wins,
            ( SELECT count(*) AS count
                   FROM findcfights(c.id) findcfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)
                  WHERE (findcfights.date <= f.date)) AS total
           FROM (fights f
             LEFT JOIN characters c ON (true))) r;


ALTER TABLE public.charactertimeline OWNER TO postgres;

--
-- Name: charactervs; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW charactervs AS
 SELECT x.cid1,
    x.cname1,
    x.cid2,
    x.cname2,
    x.total,
    x.wins,
        CASE
            WHEN (x.total = 0) THEN NULL::double precision
            ELSE ((x.wins)::double precision / (x.total)::double precision)
        END AS winpct
   FROM ( SELECT c.id AS cid1,
            c.name AS cname1,
            d.id AS cid2,
            d.name AS cname2,
            ( SELECT count(*) AS count
                   FROM findcfights(c.id, d.id) findcfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)) AS total,
            ( SELECT count(*) AS count
                   FROM findcfights(c.id, d.id) findcfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)
                  WHERE (findcfights.winnerchar = c.id)) AS wins
           FROM (characters c
             LEFT JOIN characters d ON ((c.id <> d.id)))) x;


ALTER TABLE public.charactervs OWNER TO postgres;

--
-- Name: characterwins; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW characterwins AS
 SELECT x.player,
    x.playername,
    x."character",
    x.charactername,
    x.total,
    x.wins,
        CASE
            WHEN (x.total = 0) THEN NULL::double precision
            ELSE ((x.wins)::double precision / (x.total)::double precision)
        END AS winpct
   FROM ( SELECT p.id AS player,
            p.name AS playername,
            c.id AS "character",
            c.name AS charactername,
            ( SELECT count(*) AS count
                   FROM findfights(p.id, c.id) findfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)) AS total,
            ( SELECT count(*) AS count
                   FROM findfights(p.id, c.id) findfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)
                  WHERE (findfights.winner = p.id)) AS wins
           FROM (players p
             LEFT JOIN characters c ON (true))) x;


ALTER TABLE public.characterwins OWNER TO postgres;

--
-- Name: playermeta; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW playermeta AS
 SELECT x.id,
    x.name,
    x.total,
    x.wins,
        CASE
            WHEN (x.total = 0) THEN NULL::double precision
            ELSE ((x.wins)::double precision / (x.total)::double precision)
        END AS winpct
   FROM ( SELECT p.id,
            p.name,
            ( SELECT count(*) AS count
                   FROM findpfights(p.id) findpfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)) AS total,
            ( SELECT count(*) AS count
                   FROM findpfights(p.id) findpfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)
                  WHERE (findpfights.winner = p.id)) AS wins
           FROM players p) x;


ALTER TABLE public.playermeta OWNER TO postgres;

--
-- Name: playertimeline; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW playertimeline AS
 SELECT r.date,
    r.player,
    r.wins,
    r.total,
        CASE
            WHEN (r.total = 0) THEN NULL::double precision
            ELSE ((r.wins)::double precision / (r.total)::double precision)
        END AS winpct
   FROM ( SELECT DISTINCT f.date,
            p.id,
            p.name AS player,
            ( SELECT count(*) AS count
                   FROM fights
                  WHERE ((p.id = fights.winner) AND (fights.date <= f.date))) AS wins,
            ( SELECT count(*) AS count
                   FROM findpfights(p.id) findpfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)
                  WHERE (findpfights.date <= f.date)) AS total
           FROM (fights f
             LEFT JOIN players p ON (true))) r;


ALTER TABLE public.playertimeline OWNER TO postgres;

--
-- Name: playervs; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW playervs AS
 SELECT x.pid1,
    x.pname1,
    x.pid2,
    x.pname2,
    x.total,
    x.wins,
        CASE
            WHEN (x.total = 0) THEN NULL::double precision
            ELSE ((x.wins)::double precision / (x.total)::double precision)
        END AS winpct
   FROM ( SELECT p.id AS pid1,
            p.name AS pname1,
            q.id AS pid2,
            q.name AS pname2,
            ( SELECT count(*) AS count
                   FROM findpfights(p.id, q.id) findpfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)) AS total,
            ( SELECT count(*) AS count
                   FROM findpfights(p.id, q.id) findpfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)
                  WHERE (findpfights.winner = p.id)) AS wins
           FROM (players p
             LEFT JOIN players q ON ((p.id <> q.id)))) x;


ALTER TABLE public.playervs OWNER TO postgres;

--
-- Name: stagewins; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW stagewins AS
 SELECT x.player,
    x.playername,
    x.stage,
    x.stagename,
    x.total,
    x.wins,
        CASE
            WHEN (x.total = 0) THEN NULL::double precision
            ELSE ((x.wins)::double precision / (x.total)::double precision)
        END AS winpct
   FROM ( SELECT p.id AS player,
            p.name AS playername,
            s.id AS stage,
            s.name AS stagename,
            ( SELECT count(*) AS count
                   FROM findpfights(p.id) findpfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)
                  WHERE (findpfights.stage = s.id)) AS total,
            ( SELECT count(*) AS count
                   FROM findpfights(p.id) findpfights(id, date, player1, p1name, player2, p2name, player3, p3name, player4, p4name, character1, c1name, character2, c2name, character3, c3name, character4, c4name, stage, stagename, winner, winnername, winnerchar, winnercharname, notes)
                  WHERE ((findpfights.stage = s.id) AND (findpfights.winner = p.id))) AS wins
           FROM (players p
             LEFT JOIN stages s ON (true))) x;


ALTER TABLE public.stagewins OWNER TO postgres;

--
-- Name: u_characters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE u_characters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.u_characters_id_seq OWNER TO postgres;

--
-- Name: u_characters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE u_characters_id_seq OWNED BY u_characters.id;


--
-- Name: u_fights_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE u_fights_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.u_fights_id_seq OWNER TO postgres;

--
-- Name: u_fights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE u_fights_id_seq OWNED BY u_fights.id;


--
-- Name: u_players_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE u_players_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.u_players_id_seq OWNER TO postgres;

--
-- Name: u_players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE u_players_id_seq OWNED BY u_players.id;


--
-- Name: u_stages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE u_stages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.u_stages_id_seq OWNER TO postgres;

--
-- Name: u_stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE u_stages_id_seq OWNED BY u_stages.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_characters ALTER COLUMN id SET DEFAULT nextval('u_characters_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights ALTER COLUMN id SET DEFAULT nextval('u_fights_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_players ALTER COLUMN id SET DEFAULT nextval('u_players_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_stages ALTER COLUMN id SET DEFAULT nextval('u_stages_id_seq'::regclass);


--
-- Data for Name: u_characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY u_characters (id, name, img) FROM stdin;
1	Bowser	bowser
2	Captain Falcon	cfalcon
3	Donkey Kong	dk
4	Dr. Mario	drmario
5	Falco	falco
6	Fox	fox
7	Ganondorf	ganondorf
8	Ice Climbers	iceclimbers
9	Jigglypuff	jigglypuff
10	Kirby	kirby
11	Link	link
12	Luigi	luigi
13	Mario	mario
14	Marth	marth
15	Mewtwo	mewtwo
16	Mr. Game & Watch	mrgamewatch
17	Ness	ness
19	Pichu	pichu
20	Pikachu	pikachu
21	Roy	roy
22	Samus	samus
23	Yoshi	yoshi
24	Young Link	younglink
25	Zelda	zelda
26	Sheik	sheik
18	Peach	peach
\.


--
-- Name: u_characters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('u_characters_id_seq', 26, true);


--
-- Data for Name: u_fights; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY u_fights (id, date, player1, player2, player3, player4, character1, character2, character3, character4, stage, winner, notes) FROM stdin;
1	2014-08-30	1	2	\N	\N	9	15	\N	\N	4	2	\N
2	2014-08-30	2	3	\N	\N	3	24	\N	\N	15	2	\N
3	2014-08-30	1	3	\N	\N	1	5	\N	\N	21	1	\N
4	2014-08-30	1	3	\N	\N	5	1	\N	\N	21	1	\N
5	2014-08-31	2	3	\N	\N	\N	\N	\N	\N	3	2	\N
6	2014-08-31	2	3	\N	\N	\N	\N	\N	\N	3	2	\N
7	2014-08-31	2	3	\N	\N	\N	\N	\N	\N	3	2	\N
8	2014-09-01	2	3	\N	\N	\N	\N	\N	\N	3	2	\N
9	2014-09-01	2	3	\N	\N	\N	\N	\N	\N	3	2	\N
13	2014-09-07	3	11	1	11	17	8	25	16	16	3	\N
14	2014-09-07	2	3	4	11	8	17	6	19	11	4	\N
16	2014-09-08	11	4	14	13	1	8	22	25	26	14	\N
\.


--
-- Name: u_fights_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('u_fights_id_seq', 16, true);


--
-- Data for Name: u_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY u_players (id, name) FROM stdin;
2	Lowell
3	Luke
4	Steven
11	Amin
1	Johnny
12	testplyaer
13	anewguy
14	a new player
15	Testguy
\.


--
-- Name: u_players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('u_players_id_seq', 15, true);


--
-- Data for Name: u_stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY u_stages (id, name, img) FROM stdin;
1	Battlefield	battlefield
3	Brinstar	brinstar
4	Brinstar Depths	brinstar-depths
5	Corneria	corneria
6	Final Destination	final-destination
7	Flat Zone	flat-zone
8	Fountain of Dreams	fountain-of-dreams
9	Fourside	fourside
10	Great Bay	great-bay
11	Green Greens	green-greens
12	Icicle Mountain	icicle-mountain
13	Jungle Japes	jungle-japes
14	Kingdom	kingdom
15	Kingdom II	kingdom-ii
16	Kongo Jungle	kongo-jungle
17	Mute City	mute-city
18	Onett	onett
19	Poké Floats	poke-floats
20	Pokémon Stadium	pokemon-stadium
21	Princess Peach's Castle	princess-peachs-castle
22	Rainbow Cruise	rainbow-cruise
23	Temple	temple
24	Venom	venom
25	Yoshi's Island	yoshis-island
26	Yoshi's Story	yoshis-story
27	Past Stages: Dream Land	past-dream-land
28	Past Stages: Kongo Jungle	past-kongo-jungle
29	Past Stages: Yoshi's Island	past-yoshis-island
2	Big Blue	big-blue
\.


--
-- Name: u_stages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('u_stages_id_seq', 29, true);


--
-- Name: u_characters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY u_characters
    ADD CONSTRAINT u_characters_pkey PRIMARY KEY (id);


--
-- Name: u_fights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_pkey PRIMARY KEY (id);


--
-- Name: u_players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY u_players
    ADD CONSTRAINT u_players_pkey PRIMARY KEY (id);


--
-- Name: u_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY u_stages
    ADD CONSTRAINT u_stages_pkey PRIMARY KEY (id);


--
-- Name: u_fights_character1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_character1_fkey FOREIGN KEY (character1) REFERENCES u_characters(id);


--
-- Name: u_fights_character2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_character2_fkey FOREIGN KEY (character2) REFERENCES u_characters(id);


--
-- Name: u_fights_character3_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_character3_fkey FOREIGN KEY (character3) REFERENCES u_characters(id);


--
-- Name: u_fights_character4_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_character4_fkey FOREIGN KEY (character4) REFERENCES u_characters(id);


--
-- Name: u_fights_player1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_player1_fkey FOREIGN KEY (player1) REFERENCES u_players(id);


--
-- Name: u_fights_player2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_player2_fkey FOREIGN KEY (player2) REFERENCES u_players(id);


--
-- Name: u_fights_player3_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_player3_fkey FOREIGN KEY (player3) REFERENCES u_players(id);


--
-- Name: u_fights_player4_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_player4_fkey FOREIGN KEY (player4) REFERENCES u_players(id);


--
-- Name: u_fights_stage_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_stage_fkey FOREIGN KEY (stage) REFERENCES u_stages(id);


--
-- Name: u_fights_winner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY u_fights
    ADD CONSTRAINT u_fights_winner_fkey FOREIGN KEY (winner) REFERENCES u_players(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

