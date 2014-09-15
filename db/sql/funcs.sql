CREATE FUNCTION findfights(p integer, c integer)
  RETURNS SETOF fights AS
$$ 
SELECT * FROM fights WHERE 
(player1=p AND character1=c) OR
(player2=p AND character2=c) OR
(player3=p AND character3=c) OR
(player4=p AND character4=c) 
$$
  LANGUAGE sql;

CREATE FUNCTION findfights(p varchar, c varchar)
  RETURNS SETOF fights AS
$$ 
SELECT * FROM fights WHERE 
(lower(p1name)=p AND lower(c1name)=c) OR
(lower(p2name)=p AND lower(c2name)=c) OR
(lower(p3name)=p AND lower(c3name)=c) OR
(lower(p4name)=p AND lower(c4name)=c) 
$$
  LANGUAGE sql;

CREATE FUNCTION findfights(p integer, c varchar)
  RETURNS SETOF fights AS
$$ 
SELECT * FROM fights WHERE 
(player1=p AND lower(c1name)=c) OR
(player2=p AND lower(c2name)=c) OR
(player3=p AND lower(c3name)=c) OR
(player4=p AND lower(c4name)=c) 
$$
  LANGUAGE sql;

CREATE FUNCTION findfights(p varchar, c integer)
  RETURNS SETOF fights AS
$$ 
SELECT * FROM fights WHERE 
(lower(p1name)=p AND character1=c) OR
(lower(p2name)=p AND character2=c) OR
(lower(p3name)=p AND character3=c) OR
(lower(p4name)=p AND character4=c) 
$$
  LANGUAGE sql;
