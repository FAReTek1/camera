%include backpack/camera/camera

costumes "blank.svg", "cat.svg";
hide;
list pos cats = [];
list cats_rot = [];

onflag {
    delete cats;

    s = 1;
    # by using s, it will be in layer order :)
    # that also means that it's less likely for stuff to be hidden behind other stuff
    repeat 100{
        add pos{
            x: random(-240, 240),
            y: random(-180, 180),
            s: s,
            d: random(0, 360)
        } to cats;

        add random(10, 180) to cats_rot;
        s++;
    };

    forever{tick;}
}

proc tick {
    # I have no idea why _camera.s needs to be squared
    move_camera delta * 150 * (key_pressed("d") - key_pressed("a")),
                delta * 150 * (key_pressed("w") - key_pressed("s")),
                delta * 6 * scroll_v,
                delta * 180 * (key_pressed("e") - key_pressed("q")),
                d_mouse, 
                prev_mouse_down, true;

    _camera.s = MAX(_camera.s, 0.1);

    INFER_CAM_BASIS();

    erase_all;
    switch_costume "cat";

    i = 1;
    repeat length cats {
        pos cat_pos = cam_apply_pos(cats[i]);

        cat_pos.x += cat_pos.s * sin(cats_rot[i] * timer());
        cat_pos.y += cat_pos.s * cos(cats_rot[i] * timer());
        cat_pos.d += timer() * cats_rot[i];

        # stamp shadow
        set_brightness_effect -100;
        goto_pos cat_pos;
        cstamp_shadow Node{x:0.1 * cat_pos.s, y:-0.1 * cat_pos.s}, 90;

        clear_graphic_effects;
        if touching("_mouse_") {
            goto_pos cat_pos;
            stamp;
        } else {

            # stamp in partial grayscale
            goto_pos cat_pos;
            clear_graphic_effects;
            stamp;

            set_color_effect 100;
            set_ghost_effect 60;
            stamp;

        }

        i++;
    }

    Node mouse = CAM_INV_MOUSE();

    cfill_aw pos{x: mouse.x, y: mouse.y, s: 100, d: 90}, 0.5 + 0.5 * sin(90 * timer());

    env_tick;
}
################################################################
%define NODE_MOUSE() Node{x: mouse_x(), y: mouse_y()} # macro, in this case, is better than a func in basically all cases

proc env_tick {
    delta = timer() - prev_t;
    local prev_t = timer();

    scroll_v = _scroll_up - _scroll_down;

    _scroll_up = false;
    _scroll_down = false;

    Node d_mouse = Node{x: mouse_x() - prev_mouse.x, y: mouse_y() - prev_mouse.y};
    Node prev_mouse = NODE_MOUSE();
    prev_mouse_down = mouse_down();
}

onkey "up arrow" {
    _scroll_up = not key_pressed("up arrow");
}

onkey "down arrow" {
    _scroll_down = not key_pressed("down arrow");
}

# # rorate node about origin
# func node_rot(Node p, theta) Node {
#     return Node {
#         x: $p.y * sin($theta) + $p.x * cos($theta),
#         y: $p.y * cos($theta) - $p.x * sin($theta)
#     };
# }

# # rotate node about another node
# func node_rotc(Node p, Node c, theta) Node {
#     return Node {
#         x: $c.x + ($p.y - $c.y) * sin($theta) + ($p.x - $c.x) * cos($theta),
#         y: $c.y + ($p.y - $c.y) * cos($theta) - ($p.x - $c.x) * sin($theta)
#     };
# }

