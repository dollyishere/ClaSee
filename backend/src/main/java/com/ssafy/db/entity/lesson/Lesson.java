package com.ssafy.db.entity.lesson;

import com.ssafy.db.entity.board.Photocard;
import com.ssafy.db.entity.user.Bookmark;
import com.ssafy.db.entity.user.User;
import com.ssafy.db.entity.product.Product;
import lombok.Getter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/*
* Lesson : member = N : 1
*/
@Entity
@Getter
@Table(name = "LESSON")
public class Lesson {

    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    private Category category;

    private Long maximum;
    private Long price;
    private Long runningtime;
    private String description;
    private String name;
    private String location;

    // 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "lesson")
    private List<Checklist> checkList = new ArrayList<>();

    @OneToMany(mappedBy = "lesson")
    private List<Review> reviewList = new ArrayList<>();

    @OneToMany(mappedBy = "lesson")
    private List<Bookmark> bookmarkList = new ArrayList<>();

    @OneToMany(mappedBy = "lesson")
    private List<Photocard> photocardList = new ArrayList<>();

    @OneToMany(mappedBy = "lesson")
    private List<OpenLesson> openLessonList = new ArrayList<>();

    @OneToMany(mappedBy = "lesson")
    private List<Curriculum> curriculumList = new ArrayList<>();

    @OneToMany(mappedBy = "lesson")
    private List<Product> productList = new ArrayList<>();
}