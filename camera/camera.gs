# the camera struct is identical to the pos struct ;-;
# cam't do inheritance or structs owning structs in goboscript, so it will use the exact same struct
# it's not very good to pollute the global name space like this :\
# i put an underscore but its still not very good

onflag{
    pos _camera = pos{
        x: 0,
        y: 0,
        s: 1, # not a percentage
        d: 0
    };
}

func cam_apply_node(Node p) Node {
    return Node {
        x: _camera.s * ((($p.y - _camera.y) * sin(_camera.d) + ($p.x - _camera.x) * cos(_camera.d))),
        y: _camera.s * ((($p.y - _camera.y) * cos(_camera.d) - ($p.x - _camera.x) * sin(_camera.d)))
    };
} 


func cam_apply_pos(pos p) pos {
    Node p = cam_apply_node(Node{x: $p.x, y: $p.y});
    return pos{
        x: p.x, y: p.y,
        s: _camera.s * $p.s,
        d: $p.d + _camera.d
    };
}

