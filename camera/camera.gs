# the camera struct is identical to the pos struct ;-;
# cam't do inheritance or structs owning structs in goboscript, so it will use the exact same struct
# it's not very good to pollute the global name space like this :\
# i put an underscore but its still not very good


%define RESET_CAM_BASIS() \
    Node _cam_i_hat = Node{x: 1, y: 0}; \
    Node _cam_j_hat = Node{x: 0, y: 1};

# 'infer' basis - just set basis using existing cam d/s vars
%define INFER_CAM_BASIS() set_cam_basis _camera.s, sin(_camera.d), cos(_camera.d)

proc set_cam_basis zoom, _sin, _cos {
    _cam_i_hat = Node{
        x: $_cos * $zoom,
        y: -$_sin * $zoom
    };
    _cam_j_hat = Node{
        x: $_sin * $zoom,
        y: $_cos * $zoom
    };
}

proc add_cam_basis zoom, _sin, _cos, Node i, Node j {
    # set camera basis vectors, by applying to exisiting basis vectors, allowing for skew
    _cam_i_hat = Node{
        x: ($_cos * $i.x + $_sin * $i.y) * $zoom,
        y: ($_cos * $i.y - $_sin * $i.x) * $zoom
    };
    _cam_j_hat = Node{
        x: ($_cos * $j.x + $_sin * $j.y) * $zoom,
        y: ($_cos * $j.y - $_sin * $j.x) * $zoom
    };
}

func cam_apply_node(Node p) Node {
    return Node {
        x: (($p.y - _camera.y) * _cam_j_hat.x + ($p.x - _camera.x) * _cam_i_hat.x),
        y: (($p.y - _camera.y) * _cam_j_hat.y + ($p.x - _camera.x) * _cam_i_hat.y)
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

proc move_camera dx, dy, ds, dd {
    _camera.x += $dx * _cam_i_hat.x + $dy * _cam_i_hat.y;
    _camera.y += $dx * _cam_j_hat.x + $dy * _cam_j_hat.y;

    _camera.s += $ds;
    _camera.d += $dd;
}

################################################################

onflag{
    pos _camera = pos{
        x: 0,
        y: 0,
        s: 1,
        d: 0
    };
    RESET_CAM_BASIS();
}
