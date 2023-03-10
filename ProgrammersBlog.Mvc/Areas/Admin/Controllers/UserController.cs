using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProgrammersBlog.Entities.Concrete;
using ProgrammersBlog.Entities.Dtos;
using ProgrammersBlog.Shared.Utilities.Results.ComplexTypes;
using ProgrammersBlog.Shared.Utilities.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using System.Text.Json;
using ProgrammersBlog.Mvc.Areas.Admin.Models;

namespace ProgrammersBlog.Mvc.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class UserController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IWebHostEnvironment _env;
        private readonly IMapper _mapper;

       

        public UserController(UserManager<User> userManager,IWebHostEnvironment env,IMapper mapper)
        {
            _userManager = userManager;
            _env = env;
            _mapper = mapper;
        }

        public async Task<IActionResult> Index()
        {
            var users = await _userManager.Users.ToListAsync();
            return View(new UserListDto {
                Users=users,
                ResultStatus=ResultStatus.Success
            });
            
        }
        [HttpGet]
        public IActionResult Add()
        {
            return PartialView("_UserAddPartial");

        }
        [HttpPost]
        public async Task<IActionResult> Add(UserAddDto userAddDto)
        {
            if (ModelState.IsValid)
            {
                userAddDto.Picture = await ImageUpload(userAddDto);
                var user = _mapper.Map<User>(userAddDto);
                var result = await _userManager.CreateAsync(user, userAddDto.Password);
                if (result.Succeeded)
                {
                    var userAddAjaxModel = JsonSerializer.Serialize(new UserAddAjaxViewModel
                    {
                        UserDto = new UserDto
                        {
                            ResultStatus = ResultStatus.Success,
                            Message=$"{user.UserName} adlı kullanıcı başarıyla eklenmiştir . ",
                            User=user
                        },
                        UserAddPartial = await this.RenderViewToStringAsync("-UserAddPArtial",userAddDto)
                    });
                    return Json(userAddAjaxModel);
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("",error.Description);
                    }
                    var userAddAjaxErrorModel = JsonSerializer.Serialize(new UserAddAjaxViewModel
                    {
                        UserAddDto=userAddDto,
                        UserAddPartial=await this.RenderViewToStringAsync("_userAddPartial",userAddDto),
                    });
                    return Json(userAddAjaxErrorModel);
                }
               

            }
            var userAddAjaxModelStateErrorModel = JsonSerializer.Serialize(new UserAddAjaxViewModel
            {
                UserAddDto = userAddDto,
                UserAddPartial = await this.RenderViewToStringAsync("_userAddPartial", userAddDto),
            });
            return Json(userAddAjaxModelStateErrorModel);

        }

        public async Task<string> ImageUpload(UserAddDto userAddDto) 
        {
            string wwwroot = _env.WebRootPath;
            //string fileName = Path.GetFileNameWithoutExtension(userAddDto.Picture.FileName);
            string fileExtension = Path.GetExtension(userAddDto.PictureFile.FileName);
            DateTime dateTime = DateTime.Now;
            string fileName = $"{userAddDto.UserName}_{dateTime.FullDateAndTimeStringWithUnderscore()}{fileExtension}";
            var path = Path.Combine($"{wwwroot}/img", fileName);
            await using (var stream = new FileStream(path, FileMode.Create))
            {
                await userAddDto.PictureFile.CopyToAsync(stream);
            }
            return fileName;

        }
    }
}
