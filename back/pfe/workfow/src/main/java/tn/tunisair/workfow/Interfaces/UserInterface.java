package tn.tunisair.workfow.Interfaces;


import tn.tunisair.workfow.Entities.User;

import java.util.List;
import java.util.Map;

public interface UserInterface {

    List<User> findAllUsers();
    User findById(Long id);

    Map<String,Object> findAffecteIssues(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    User ChangePassword(User user);

}
