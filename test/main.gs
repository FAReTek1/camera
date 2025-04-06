%include backpack/camera/camera

costumes "blank.svg", "cat.svg";

list pos cats = [];

onflag {
    repeat 100{
        add pos{
            x: random(-240, 240),
            y: random(-180, 180),
            s: random(0, 100),
            d: random(0, 360)
        } to cats;
    };

    forever{tick;}
}

proc tick {
    _camera.x += 5 * (key_pressed("d") - key_pressed("a"));
    _camera.y += 5 * (key_pressed("w") - key_pressed("s"));
    _camera.d += 5 * (key_pressed("e") - key_pressed("q"));
    _camera.s += 0.05 * (key_pressed("z") - key_pressed("x"));

    erase_all;
    switch_costume "cat";

    i = 1;
    repeat length cats {
        goto_pos cam_apply_pos(cats[i]);
        stamp;
        i++;
    }
}

# rorate node about origin
func node_rot(Node p, theta) Node {
    return Node {
        x: $p.y * sin($theta) + $p.x * cos($theta),
        y: $p.y * cos($theta) - $p.x * sin($theta)
    };
}

# rotate node about another node
func node_rotc(Node p, Node c, theta) Node {
    return Node {
        x: $c.x + ($p.y - $c.y) * sin($theta) + ($p.x - $c.x) * cos($theta),
        y: $c.y + ($p.y - $c.y) * cos($theta) - ($p.x - $c.x) * sin($theta)
    };
}